jQuery(document).ready(function ($) {
    console.log("init 0.1");

    var Calc;
    Calc = {
        attrs: {
            hotel: "A", //1014, 1015
            datefrom: "", // arriving date
            timefrom: "", // arriving time
            hour: 4,
            adults: 1,
            kids: 0,
            send_data: "Y",
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
        },

        /**
         * Init Callbacks on DOM elements
         */
        initCallbacks: function () {
            Calc.elements.button.click(function (e) {
                if (Calc.prepareData()) {
                    window.location = Calc.request;
                }
            });
        },

        /**
         * Init all spinners
         */
        initSpinners: function () {
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

            Calc.root.on("change", ".spinner-input", function (e) {
                //ToDo update quantity
                return false;
            });

            Calc.root.on("click", ".spinner-button", function (e) {
                console.log("spinner button click");
                var target = $(this).siblings(".spinner-input");
                var val;
                if ($(this).hasClass("spinner-up")) {
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

        },
    };

    Calc.init();
});


