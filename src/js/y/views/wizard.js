Y.Views.Wizard = Y.View.extend({
  el: "#wizard",

  events: {
    
  },

  stepCount: 0,

  steps: [
    { id: "welcome", title: "welcome (step 1)" },
    { id: "step2", title: "step2" },
    { id: "step3", title: "step3" },
    { id: "step4", title: "last step (step 4)" },
  ],

  /* serialized data */
  hasBeenStopped: false,
  stepIndex: 0,
  status: {
    CURRENT: null,
    STOPPED: "STOPPED",   // default status
    STARTED: "STARTED"
  },

  initialize: function () {
    // ensure this.steps is correct
    assert(_.isArray(this.steps));
    this.steps.forEach(function (step) {
      assert(_.isString(step.id));
      assert(_.isFunction(this[step.id])); // steps.id => il doit y avoir une fonction correspondante dans ce wizard.
    }, this);
    // default & dynamic params
    this.status.CURRENT = this.status.STOPPED;
    this.stepCount = this.steps.length;
    // load configuration
    var configuration = Y.Conf.get("wizard");
    if (configuration) {
      this.hasBeenStopped = configuration.hasBeenStopped;
      this.stepIndex = configuration.stepIndex;
      this.status.CURRENT = configuration.status;
    }
    // never been stopped: auto start
    if (!this.hasBeenStopped)
      this.start(true);
  },

  start: function (force) {
    if (this.status.CURRENT === this.status.STOPPED || force) {
      this.status.CURRENT = this.status.STARTED;
      this.render();
      this.saveStatus();
    }
  },
  stop: function (force) {
    if (this.status.CURRENT === this.status.STARTED || force) {
      this.status.CURRENT = this.status.STOPPED;
      this.render();
      this.hasBeenStopped = true;
      this.saveStatus();
    }
  },

  advance: function () {
    if (this.canAdvance()) {
      var nextStepIndex = this.stepIndex + 1;
      this.render(nextStepIndex);
      this.stepIndex = nextStepIndex;
      this.saveStatus();
    } else {
      this.stop(); // finished.
    }
  },

  goTo: function (stepId) {
    var nextStepIndex = this.getStepIndex(stepId);
    if (this.stepIndex !== nextStepIndex) {
      this.render(nextStepIndex);
      this.stepIndex = nextStepIndex;
      this.saveStatus();
    }
  },

  getStepIndex: function (stepId) {
    assert(_.isString(stepId));

    for (var i = 0; i < this.steps.length; ++i) {
      if (this.steps[i].id === stepId)
        return i;
    }
    return null;
  },

  canAdvance: function () {
    return this.stepIndex < this.stepCount;
  },

  canRewind: function () { 
    return this.stepIndex > 0;
  },

  getAchievement: function () {
    return 100 * this.stepIndex / this.stepCount;
  },

  saveStatus: function () {
    var configuration = {
      hasBeenStopped : this.hasBeenStopped,
      stepIndex: this.stepIndex,
      status: this.status.CURRENT
    };
    Y.Conf.set("wizard", configuration, { permanent: true });
  },

  render: function (stepIndex) {
    var currentStep = this[this.steps[this.stepIndex].id]
      , nextStep = null
      , nextStepIndex = null;
    // is the wizard stopped ?
    if (this.status.CURRENT === this.status.STOPPED) {
      // hidding
      currentStep.call(this, "stop");
      this.hideOverlay();
      return;
    }
    // ensure the wizard is displayed
    this.showOverlay();
    // empty the previous step
    this.$(".step").empty();
    // do we need to stop current step ?
    if (typeof stepIndex !== "undefined") {
      currentStep.call(this, "stop");
      nextStepIndex = stepIndex;
    } else {
      nextStepIndex = this.stepIndex;
    }
    nextStep = this[this.steps[nextStepIndex].id];
    // display achievement
    var achievement = '';
    for (var i = 0; i < this.steps.length - 1; ++i)
      if (i < nextStepIndex)
        achievement += ' ☑';
      else
        achievement += ' ☐';
    this.$(".achievement").html(achievement);
    // launch the next step.
    nextStep.call(this, "start");
  },

  hideOverlay: function () {
    $("body").removeClass("wizard");
  },

  showOverlay: function () {
    $("body").addClass("wizard");
  },

  /***** mutualized functions ******/
  displayMessage: function () {

  },

  /****** STEPS *******/

  /* demo step */
  welcome: function (status) {
    var template = Y.Templates.get('wizardWelcome');
    switch (status) {
      case "start":
        $(".step").html(template());
        $(".step .button.continue").click(_.bind(this.advance, this));
        $(".step .button.skip").click(_.bind(this.stop, this));
        break;
      case "stop":
        // nothing.
        break;
      default:
        assert(false);
    }
  },

  step2: function (status) {
    var template = Y.Templates.get('wizardStep2');
    switch (status) {
      case "start":
        $(".step").html(template());
        $(".step .button.continue").click(_.bind(this.advance, this));
        $(".step .button.skip").click(_.bind(this.stop, this));
        break;
      case "stop":
        // nothing.
        break;
      default:
        assert(false);
    }
  },
  step3: function (status) {
    var template = Y.Templates.get('wizardStep3');
    switch (status) {
      case "start":
        $(".step").html(template());
        $(".step .button.continue").click(_.bind(this.advance, this));
        $(".step .button.skip").click(_.bind(this.stop, this));
        break;
      case "stop":
        // nothing.
        break;
      default:
        assert(false);
    }
  },
  step4: function (status) {
    var template = Y.Templates.get('wizardStep4');
    switch (status) {
      case "start":
        $(".step").html(template());
        $(".step .button.continue").click(_.bind(this.advance, this));
        $(".step .button.skip").click(_.bind(this.stop, this));
        break;
      case "stop":
        // nothing.
        break;
      default:
        assert(false);
    }
  }
});