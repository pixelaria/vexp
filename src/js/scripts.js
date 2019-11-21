$(function () {
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
            return false;
        },

        /**
         * Form request string based on all parameters
         * @returns {string}
         */
        formRequest: function () {

            var request = "/booking/?";

            for (const [key, value] of Object.entries(test)) {
                console.log(key, value);
            }

            Object.keys(this.attrs).forEach(function (key) {
                var val = this.attrs[key];
                if (val) {
                    request += "&" + key + "=" + this.attrs[key];
                }
            });
            return request;
        },

        /**
         * PrepareData for request generator
         */
        prepareData: function() {

        }
    };
})();
