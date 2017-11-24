/* eslint no-console: 0 */

$(document).ready(function() {
    var userSettings = {
        numbersCircle: 3,
        delay: 100,
        direction: 'right'
    }


    var semitsvetik = {
        defaultSettings: {
            numbersCircle: 1,
            delay: 3000,
            direction: 'right',
            startColor: 'red'
        },
        init: function(settings) {
            this.settings = $.extend(true, this.defaultSettings, settings);
            this.$flower = $('.js-flower');
            this.$leaf = $('.js-flower-leaf');
            this.nums = this.getNums();
            this.settings.defaultColor = this.$leaf.css('background-color');
            this.circle = 1;
            this.i = 0;
            this.isInit = true;
        },
        getNums: function() {
            var nums = [];
            this.$leaf.each(function(index) {
                nums.push(index);
            })

            nums.push(0)

            return nums;
        },
        changeDirection: function(oldDirection) {
            if (oldDirection === 'right') {
                this.settings.direction = 'left';
            } else {
                this.settings.direction = 'right';
            }

            this.nums.reverse();
        },
        start: function(usrSettings) {

            if (!this.isInit) {
                this.init(usrSettings);
            }

            var self = this;

            self.interval = setInterval(function() {
                if (self.i < self.$leaf.length) {
                    self.changeColor(self.nums[self.i], self.settings.startColor);
                    self.i++;

                } else {
                    self.i = 0;

                    if (self.circle !== self.settings.numbersCircle) {
                        self.circle++;
                        self.changeColor(self.nums[self.i], self.settings.startColor);
                        self.i++;
                    } else {
                        self.stop();
                        self.changeDirection(self.settings.direction);

                        self.start();
                    }
                }
            }, self.settings.delay);
        },
        pause: function() {
            clearInterval(this.interval);
        },
        stop: function() {
            clearInterval(this.interval);
            this.i = 0;
            this.circle = 1;
            this.$leaf.css({
                'background-color': this.settings.defaultColor
            })
        },
        changeColor: function(num, color) {
            var $el = this.$leaf.filter(function() {
                return $(this).data('num') === num;
            });

            this.$leaf.css({
                'background-color': this.settings.defaultColor
            })

            $el.css({
                'background-color': color
            })
        }

    }


    var $btnStart = $('.js-btn-start'),
        $btnStop = $('.js-btn-stop'),
        $btnPause = $('.js-btn-pause');

    $btnStart.on('click', function() {
        semitsvetik.start(userSettings);
    })

    $btnStop.on('click', function() {
        semitsvetik.stop();
    })

    $btnPause.on('click', function() {
        semitsvetik.pause();
    })
})