// Tween Mixin
const TweenMixin = {
    watch: {
        initScript: function () {
            this.initTween();
        }
    },

    methods: {
        initTween() {
            const pc = this.$pc;
            const Tween = pc.createScript('tween');
            // Setup attributes
            Tween.attributes.add('tweens', {
                type: 'json',
                schema: [
                    {
                        name: 'autoPlay',
                        title: 'Autoplay',
                        description: 'Play tween immediately.',
                        type: 'boolean',
                        default: false
                    }, {
                        name: 'event',
                        title: 'Trigger Event',
                        description: 'Play tween on the specified event name. This event must be fired on the global application object (e.g. this.app.fire(\'eventname\');).',
                        type: 'string'
                    }, {
                        name: 'path',
                        title: 'Path',
                        description: 'The path from the entity to the property. e.g. \'light.color\', \'camera.fov\' or \'script.vehicle.speed\'.',
                        type: 'string'
                    }, {
                        name: 'relative',
                        title: 'Relative',
                        description: 'If checked, the start value is ingored and the end value will be the relative offset from the property\'s current value.',
                        type: 'boolean',
                        default: false
                    }, {
                        name: 'start',
                        title: 'Start',
                        type: 'vec4'
                    }, {
                        name: 'end',
                        title: 'End',
                        type: 'vec4'
                    }, {
                        name: 'easingFunction',
                        title: 'Easing Function',
                        type: 'number',
                        enum: [
                            { 'Linear': 0 },
                            { 'Quadratic': 1 },
                            { 'Cubic': 2 },
                            { 'Quartic': 3 },
                            { 'Quintic': 4 },
                            { 'Sinusoidal': 5 },
                            { 'Exponential': 6 },
                            { 'Circular': 7 },
                            { 'Elastic': 8 },
                            { 'Back': 9 },
                            { 'Bounce': 10 }
                        ]
                    }, {
                        name: 'easingType',
                        title: 'Easing Type',
                        type: 'number',
                        enum: [
                            { 'In': 0 },
                            { 'Out': 1 },
                            { 'InOut': 2 }
                        ]
                    }, {
                        name: 'duration',
                        title: 'Duration',
                        description: 'Time to execute the tween in milliseconds. Defaults to 1000.',
                        type: 'number',
                        default: 1000
                    }, {
                        name: 'delay',
                        title: 'Delay',
                        description: 'Time to wait in milliseconds after receiving the trigger event before executing the tween. Defaults to 0.',
                        type: 'number',
                        default: 0
                    }, {
                        name: 'repeat',
                        title: 'Repeat',
                        description: 'The number of times the tween should be repeated after the initial playback. Defaults to 0.',
                        type: 'number',
                        default: 0
                    }, {
                        name: 'repeatDelay',
                        title: 'Repeat Delay',
                        description: 'Time to wait in milliseconds before executing each repeat of the tween. Defaults to 0.',
                        type: 'number',
                        default: 0
                    }, {
                        name: 'yoyo',
                        title: 'Yoyo',
                        description: 'This function only has effect if used along with repeat. When active, the behaviour of the tween will be like a yoyo, i.e. it will bounce to and from the start and end values, instead of just repeating the same sequence from the beginning. Defaults to false.',
                        type: 'boolean',
                        default: false
                    }, {
                        name: 'startEvent',
                        title: 'Start Event',
                        description: 'Executed right before the tween starts animating, after any delay time specified by the delay method. This will be executed only once per tween, i.e. it will not be run when the tween is repeated via repeat(). It is great for synchronising to other events or triggering actions you want to happen when a tween starts.',
                        type: 'string'
                    }, {
                        name: 'stopEvent',
                        title: 'Stop Event',
                        description: 'Executed when a tween is explicitly stopped via stop(), but not when it is completed normally.',
                        type: 'string'
                    }, {
                        name: 'updateEvent',
                        title: 'Update Event',
                        description: 'Executed each time the tween is updated, after the values have been actually updated.',
                        type: 'string'
                    }, {
                        name: 'completeEvent',
                        title: 'Complete Event',
                        description: 'Executed when a tween is finished normally (i.e. not stopped).',
                        type: 'string'
                    }, {
                        name: 'repeatEvent',
                        title: 'Repeat Event',
                        description: 'Executed whenever a tween has just finished one repetition and will begin another.',
                        type: 'string'
                    }
                ],
                array: true
            });

            // initialize code called once per entity
            Tween.prototype.initialize = function () {
                const app = this.app;
                let i;

                this.tweenInstances = [];
                this.tweenCallbacks = [];

                const makeStartCallback = function (i) {
                    return function () {
                        this.start(i);
                    };
                };

                for (i = 0; i < this.tweens.length; i++) {
                    const tween = this.tweens[i];
                    if (tween.autoPlay) {
                        this.start(i);
                    }
                    if (tween.event.length > 0) {
                        this.tweenCallbacks[i] = {
                            event: tween.event,
                            cb: makeStartCallback(i)
                        };
                        app.on(this.tweenCallbacks[i].event, this.tweenCallbacks[i].cb, this);
                    }
                }

                this.on('enable', function () {
                    for (i = 0; i < this.tweens.length; i++) {
                        if (this.tweenInstances[i] && this.tweenInstances[i].isPaused()) {
                            this.tweenInstances[i].resume();
                        }
                    }
                });

                this.on('disable', function () {
                    for (i = 0; i < this.tweens.length; i++) {
                        if (this.tweenInstances[i]) {
                            this.tweenInstances[i].pause();
                        }
                    }
                });

                this.on('attr', function () {
                    for (i = 0; i < this.tweenCallbacks.length; i++) {
                        if (this.tweenCallbacks[i]) {
                            app.off(this.tweenCallbacks[i].event, this.tweenCallbacks[i].cb, this);
                            this.tweenCallbacks[i] = null;
                        }
                    }

                    for (i = 0; i < this.tweens.length; i++) {
                        const tween = this.tweens[i];
                        if (tween.event.length > 0) {
                            this.tweenCallbacks[i] = {
                                event: tween.event,
                                cb: makeStartCallback(i)
                            };
                            app.on(this.tweenCallbacks[i].event, this.tweenCallbacks[i].cb, this);
                        }
                    }
                });
            };

            Tween.prototype.start = function (idx) {
                const app = this.app;
                let tween = this.tweens[idx];

                const easingTypes = ['In', 'Out', 'InOut'];
                const easingFuncs = ['Linear', 'Quadratic', 'Cubic', 'Quartic', 'Quintic', 'Sinusoidal', 'Exponential', 'Circular', 'Elastic', 'Back', 'Bounce'];

                let easingFunc;
                if (tween.easingFunction === 0) {
                    easingFunc = TWEEN_JS.Easing[easingFuncs[tween.easingFunction]].None;
                } else {
                    easingFunc = TWEEN_JS.Easing[easingFuncs[tween.easingFunction]][easingTypes[tween.easingType]];
                }

                const tweenInstances = this.tweenInstances;
                if (tweenInstances[idx]) {
                    tweenInstances[idx].stop();
                }

                const pathSegments = tween.path.split('.');
                let propertyOwner = this.entity;
                for (let i = 0; i < pathSegments.length - 1; i++) {
                    propertyOwner = propertyOwner[pathSegments[i]];
                }

                let propertyName = pathSegments[pathSegments.length - 1];
                let property = propertyOwner[propertyName];

                let startValue, endValue;
                let isNumber = typeof property === 'number';
                let start = tween.start;
                let end = tween.end;

                if (isNumber) {
                    startValue = { x: start.x };
                    endValue = { x: end.x };
                } else if (property instanceof pc.Vec2) {
                    startValue = new pc.Vec2(start.x, start.y);
                    endValue = new pc.Vec2(end.x, end.y);
                } else if (property instanceof pc.Vec3) {
                    startValue = new pc.Vec3(start.x, start.y, start.z);
                    endValue = new pc.Vec3(end.x, end.y, end.z);
                } else if (property instanceof pc.Vec4) {
                    startValue = start.clone();
                    endValue = end.clone();
                } else if (property instanceof pc.Color) {
                    startValue = new pc.Color(start.x, start.y, start.z, start.w);
                    endValue = new pc.Color(end.x, end.y, end.z, end.w);
                } else {
                    startValue = new pc.Vec3(start.x, start.y, start.z);
                }

                propertyOwner[propertyName] = isNumber ? startValue.x : startValue;

                switch (propertyName) {
                    case 'localPosition':
                        propertyOwner.setLocalPosition(startValue);
                        break;
                    case 'localEulerAngles':
                        propertyOwner.setLocalEulerAngles(startValue);
                        startValue = { x: 0 };
                        endValue = { x: 1 };
                        break;
                    case 'localScale':
                        propertyOwner.setLocalScale(startValue);
                        break;
                    case 'position':
                        propertyOwner.setPosition(startValue);
                        break;
                    case 'eulerAngles':
                        propertyOwner.setEulerAngles(startValue);
                        startValue = { x: 0 };
                        endValue = { x: 1 };
                        break;
                }

                if (propertyOwner instanceof pc.Material) {
                    propertyOwner.update();
                }

                tweenInstances[idx] = new TWEEN_JS.Tween(startValue)
                    .to(endValue, tween.duration)
                    .easing(easingFunc)
                    .onStart(function () {
                        if (tween.startEvent !== '') {
                            app.fire(tween.startEvent);
                        }
                    })
                    .onStop(function () {
                        if (tween.stopEvent !== '') {
                            app.fire(tween.stopEvent);
                        }
                        tweenInstances[idx] = null;
                    })
                    .onUpdate(function (obj) {
                        propertyOwner[propertyName] = isNumber ? obj.x : obj;

                        switch (propertyName) {
                            case 'localPosition':
                                propertyOwner.setLocalPosition(obj);
                                break;
                            case 'localEulerAngles':
                                propertyOwner.setLocalEulerAngles(obj);
                                break;
                            case 'localScale':
                                propertyOwner.setLocalScale(obj);
                                break;
                            case 'position':
                                propertyOwner.setPosition(obj);
                                break;
                            case 'eulerAngles': {
                                const r = new pc.Quat();
                                const s = new pc.Quat().setFromEulerAngles(start.x, start.y, start.z);
                                const e = new pc.Quat().setFromEulerAngles(end.x, end.y, end.z);
                                r.slerp(s, e, obj.x);
                                propertyOwner.setRotation(r);
                                break;
                            }
                        }

                        if (propertyOwner instanceof pc.Material) {
                            propertyOwner.update();
                        }

                        if (tween.updateEvent !== '') {
                            app.fire(tween.updateEvent);
                        }
                    })
                    .onComplete(function () {
                        if (tween.completeEvent !== '') {
                            app.fire(tween.completeEvent);
                        }
                        tweenInstances[idx] = null;
                    })
                    .onRepeat(function () {
                        if (tween.repeatEvent !== '') {
                            app.fire(tween.repeatEvent);
                        }
                    })
                    .repeat(tween.repeat)
                    .repeatDelay(tween.repeatDelay)
                    .yoyo(tween.yoyo)
                    .delay(tween.delay)
                    .start();
            };

            // We have to update the tween.js engine somewhere once a frame...
            if (this.app) {
                this.app.on('update', function () {
                    TWEEN_JS.update();
                });
            }
        }
    }
}

import * as TWEEN_JS from '@tweenjs/tween.js';
export default TweenMixin