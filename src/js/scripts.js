jQuery(document).ready(function ($) {
    console.log("init 0.1");

    var Calc;

    Calc = {
        attrs: {
            hotel: "1014", //1014, 1015
            datefrom: "", // arriving date
            timefrom: "", // arriving time
            hour: 4,
            adults: 1,
            kids: 0,
            send_data: "N",
            lang: "ru",
        },
        elements: {},
        request: "/booking/",

        /**
         * Base initialization
         */
        init: function () {
            console.log("Cart");
            this.prepareDOM();
            this.initCallbacks();
            this.initTabber();
            this.initSpinners();
            this.initDatetime();
            this.formRequest();
        },

        /**
         * Get all DOM elements
         */
        prepareDOM: function () {
            Calc.root = $("#calc");

            Calc.elements.hotel = Calc.root.find("input[name=\"hotel\"]");
            Calc.elements.datefrom = Calc.root.find("input[name=\"datefrom\"]");
            Calc.elements.timefrom = Calc.root.find("input[name=\"timefrom\"]");
            Calc.elements.hour = Calc.root.find("input[name=\"hour\"]");
            Calc.elements.adults = Calc.root.find("input[name=\"adults\"]");
            Calc.elements.kids = Calc.root.find("input[name=\"kids\"]");
            Calc.elements.button = Calc.root.find(".calc__btn");

            /* default values */
            Calc.attrs.datefrom =  $.datepicker.formatDate('dd.mm.y', new Date());
            Calc.elements.datefrom.val =  Calc.attrs.datefrom;
        },

        /**
         * Init Callbacks on DOM elements
         */
        initCallbacks: function () {
            Calc.elements.button.click(function (e) {
                console.log('Calc.elements.button');
                if (Calc.prepareData()) {
                    window.location = Calc.request;
                }
            });


        },

        /**
         * Init all spinners
         */
        initSpinners: function () {
            console.log('Init spinners');

            Calc.root.on("keydown", ".spinner-input", function (e) {
                var val;
                if (e.which == 38) {
                    val = parseInt($(this).val()) + 1;
                } else if (e.which == 40) {
                    val = parseInt($(this).val()) - 1;
                }
                if (val < 1) val = 1;
                if (val > 99) val = 99;
                $(this).val(val);
                return false;
            });

            Calc.root.on("change", ".spinner__input", function (e) {
                //ToDo update quantity
                return false;
            });

            Calc.root.on("click", ".spinner__button", function (e) {
                console.log("spinner button click");
                var target = $(this).parent().siblings(".spinner__input");
                var val;
                if ($(this).hasClass("spinner__button--up")) {
                    val = parseInt(target.val()) + 1;
                } else {
                    val = parseInt(target.val()) - 1;
                }
                if (val < 1) val = 1;
                if (val > 99) val = 99;
                $(target).val(val).change();
                return false;
            });

        },

        initTabber: function() {
            console.log("Init tabber");

            $('.tabber__item').click(function(e){
                var value = $(this).data('value');
                $(this).siblings('.tabber__item').removeClass('tabber__item--active');
                $(this).siblings('.tabber__input').val(value);
                $(this).addClass('tabber__item--active');
            });
        },

        /**
         * Init all datatime & time widgets
         */
        initDatetime: function () {
            console.log("initDatetime");

            Calc.elements.datefrom.datepicker({
                userLang: "ru",
                mode: "range",
                regional: "ru",
                showButtonPanel: false,
                hideIfNoPrevNext: true,
                firstDay: "1",
                dateFormat: "dd.mm.yy",
            });


            Calc.elements.timefrom.timepicker({
                timeFormat: 'hh:mm',
                interval: 30,
                minTime: '9',
                defaultTime: '11',
                startTime: '10:00',
                dynamic: true,
                dropdown: true,
                scrollbar: true
            });

        },

        /**
         * Form request string based on all parameters
         * @returns {string}
         */
        formRequest: function () {

            var request = "/booking/?";

            Object.keys(Calc.attrs).forEach(function (key) {
                var val = Calc.attrs[key];
                if (val) {
                    request += "&" + key + "=" + Calc.attrs[key];
                }
            });
            return request;
        },

        /**
         * PrepareData for request generator
         */
        prepareData: function () {
            console.log('prepareData');

            var date = Calc.elements.datefrom.datepicker('getDate');

            Calc.attrs.datefrom =  $.datepicker.formatDate('dd.mm.yy', date);
            Calc.attrs.timefrom =  Calc.elements.timefrom.val().replace(':','');

            Calc.attrs.hotel = Calc.elements.hotel.val();

            Calc.attrs.hour = Calc.elements.hour.val();
            Calc.attrs.adults = Calc.elements.adults.val();
            Calc.attrs.kids = Calc.elements.kids.val();

            console.log(Calc.formRequest());
        },
    };

    Calc.init();
});


