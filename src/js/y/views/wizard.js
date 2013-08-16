Y.Views.Wizard = Y.View.extend({
  el: "#wizard",

  events: {
    
  },

  stepCount: 0,

  steps: [
    { id: "welcome", title: "welcome (step 1)" },
    { id: "profil", title: "profil" }
    //{ id: "step3", title: "step3" }
  ],

  /* serialized data */
  hasBeenStopped: false,
  stepIndex: 0,
  status: {
    CURRENT: null,
    STOPPED: "STOPPED",   // default status
    STARTED: "STARTED"
  },

  // loosing substep while stopping / restart the app.
  substepIndex: 0,

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
  restart: function () { // debug purpose
    this.stop(true);
    this.hasBeenStopped = false;
    this.stepIndex = 0;
    this.start(true);
  },
  startAt: function (stepId) {
    this.status.CURRENT = this.status.STARTED;
    this.stepIndex = 0; // FIXME: va forcer la fermeture du step 0 ..
    this.goTo(stepId);
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
    return this.stepIndex + 1 < this.stepCount;
  },

  canRewind: function () { 
    return this.stepIndex > 0;
  },

  getAchievement: function (stepIndex, substep) {
    stepIndex = stepIndex || this.stepIndex;
    var substepAchievement = 0;
    if (substep)
      substepAchievement = (1 / this.stepCount) * (this.substepIndex / this.substepCount);
    return Math.round(100 * ((stepIndex / this.stepCount) + substepAchievement));
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
    var that = this;
    nextStep = this[this.steps[nextStepIndex].id];

    // launch the next step, with a little delay, so this.stepIndex is updated.
    setTimeout(function () {
      that.renderAchievement();
      nextStep.call(that, "start");
    }, 10);
  },

  renderAchievement: function (substep) {
    $(".achievement").css("width", this.getAchievement(this.stepIndex, substep)+'%');
  },

  hideOverlay: function () {
    $("body").removeClass("wizard");
  },

  showOverlay: function () {
    $("body").addClass("wizard");
  },

  /***** SUBSTEPS ******/
  initializeSubsteps: function (substepsFuncs) {
    this.substepIndex = 0;
    this.substepCount = $('.step div[data-substep]').length;
    this.substepFuncs = substepsFuncs;
    $(".step .button.continue").click(_.bind(this.advance, this));
    $(".step .button.skip").click(_.bind(this.stop, this));
  },

  startSubsteps: function (substepIndex) {
    if (typeof substepIndex === "undefined")
      substepIndex = this.substepIndex;
    // hide all substeps
    $('.step div[data-substep]').hide();
    // show only the good one.
    $('.step div[data-substep="'+substepIndex+'"]').show();
    // maybe use a custom func
    var f = this.substepFuncs[substepIndex];
    if (_.isFunction(f))
      f.call(this, "start");
  },

  advanceSubsteps: function () {
    // stop current substep
    this.stopSubsteps(this.substepIndex);
    // increment substep
    this.substepIndex++;
    // start next substep
    this.startSubsteps(this.substepIndex);
  },

  stopSubsteps: function (substepIndex) {
    if (typeof substepIndex === "undefined")
      substepIndex = this.substepIndex;
    // maybe use a func
    var f = this.substepFuncs && this.substepFuncs[substepIndex];
    if (_.isFunction(f))
      f.call(this, "stop");
    // auto remove pastille
    this.removePastille();
    // clearing registered callback
    this.autoUnregisteredCallback(null, null, null, 'off');
    // hide all substeps
    $('.step div[data-substep]').hide();
  },

  get$Pastille: function () {
    return $('<div id="pastille" style="position:absolute;width:20px;height:20px;background-color:red;border-radius:10px;"></div>')
  },

  removePastille: function () {
    $("#pastille").remove();
  },

  /****** STEPS *******/
  
  /* demo step */
  welcome: function (status) {
    var template = Y.Templates.get('wizard-welcome');
    switch (status) {
      case "start":
        $(".step").html(template()).i18n();
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

  profil: function (status) {
    var template = Y.Templates.get('wizard-profil');
    switch (status) {
      case "start":
        $(".step").html(template()).i18n();
        this.initializeSubsteps([
          this.step2sub0,
          this.step2sub1,
          this.step2sub2,
          this.step2sub3,
          this.step2sub4,
          this.step2sub5
        ]);
        this.startSubsteps();
        break;
      case "stop":
        // nothing.
        this.stopSubsteps();
        break;
      default:
        assert(false);
    }
  },

  // brrrr..
  // FIXME: refactoring of all this...
  autoUnregisteredCallback: (function () {
    var _obj = null
      , _event = null
      , _callback = null;

    return function (obj, event, callback, type) {
      type = type || "one";
      if (type === "off") {
        if (_obj && _event && _callback) {
          _obj.off(_event, _callback);
          _obj = null;
          _event = null;
          _callback = null;
        }
      } else {
        if (_obj && _event && _callback) {
          console.log('WARNING: might be a bug in wizard, ' + _event + ' / ' + _callback + 
                      ' replaced by ' + event + '/' + callback);
        }
        // replacing obj, event & callback.
        _obj = obj;
        _event = event;
        _callback = _.bind(callback, this);
        _obj[type](_event, _callback);
      }
    };
  })(),

  // cliquer sur mon compte
  step2sub0: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("top", "-10px");
      pastille.css("left", "-10px");
      $('#navbar a[data-fragment="account"]').append(pastille);
      this.autoUnregisteredCallback(
        $('#navbar a[data-fragment="account"]'),
        this.pointerDown,
        function () {
          Y.Router.once("pageChanged", this.advanceSubsteps, this);
        }
      );
    } else {
      // nothing yet
    }
  },

  // cliquer sur mon profil
  step2sub1: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("position", "relative");
      pastille.css("top", "-40px");
      pastille.css("left", "40px");
      $('#content a[href="#players/form"]').append(pastille);
      this.autoUnregisteredCallback(
        Y.Router,
        "pageChanged",
        function (nextPageName, nextPageHash) {
          if (nextPageName == "playerForm") {
            Y.Router.off("pageChanged", this.onPageChanged, this); // self unregister
            this.advanceSubsteps();
          }
        },
        "on");
    } else {
      // nothing yet
    }
  },

  // remplir le nom
  step2sub2: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("position", "absolute");
      pastille.css("right", "40px");
      pastille.css("top", "70px");
      $('#name').parent().append(pastille);
      this.autoUnregisteredCallback(
        $('.button.next3'),
        "click",
        function () {
          Y.Router.unlock();
          this.advanceSubsteps();
        });
      Y.Router.lock();
    } else {
      Y.Router.unlock();
    }
  },

  // remplir le classement
  step2sub3: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("position", "absolute");
      pastille.css("right", "40px");
      pastille.css("top", "120px");
      $('#rank').parent().append(pastille);
      this.autoUnregisteredCallback(
        $('.button.next4'),
        "click",
        function () {
          Y.Router.unlock();
          this.advanceSubsteps();
        });
      Y.Router.lock();
    } else {
      Y.Router.unlock();
    }
  },

  // remplir le club
  step2sub4: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("position", "absolute");
      pastille.css("right", "40px");
      pastille.css("top", "170px");
      $('#club').parent().append(pastille);
      this.autoUnregisteredCallback(
        $('.button.next5'),
        "click",
        function () {
          Y.Router.unlock();
          this.advanceSubsteps();
        });
      Y.Router.lock();
    } else {
      Y.Router.unlock();
    }
  },

  // cliquer sur enregistrer
  step2sub5: function (status) {
    if (status === "start") {
      this.renderAchievement(true);
      var pastille = this.get$Pastille();
      pastille.css("position", "absolute");
      pastille.css("left", "45%");
      pastille.css("top", "-10px");
      $('#savePlayer').append(pastille);
      this.autoUnregisteredCallback(
        $('#savePlayer'),
        "mousedown",
        function () {
          Y.Router.unlock();
          this.advanceSubsteps();
        });
      Y.Router.lock();
    } else {
      Y.Router.unlock();
    }
  },

  step3: function (status) {
    var template = Y.Templates.get('wizard-step3');
    switch (status) {
      case "start":
        $(".step").html(template()).i18n();
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