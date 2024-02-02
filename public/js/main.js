(function($) {

    "use strict";




    jQuery(document).on('ready', function() {
        const cart = JSON.parse(localStorage.getItem("cart"));
        let sum = 0;
        for (const key in cart) {
            sum += parseInt(cart[key])
        }
        $('#cartCount').text(sum)


        const MAINCONTENT = $("#body").attr('url');

        //===== Sticky

        jQuery(window).on('scroll', function(event) {
            var scroll = jQuery(window).scrollTop();
            if (scroll < 150) {
                jQuery(".appie-sticky").removeClass("sticky");
            } else {
                jQuery(".appie-sticky").addClass("sticky");
            }
        });



        $(".addToCart").click(function(event) {
            const inputValue = $(this).prev('div').find("input").val()
            const inputRef = $(this).prev('div').find("input").attr('id')
            if (inputValue > 0) {
                const retrievedObject = JSON.parse(localStorage.getItem("cart"));

                const cart = {
                    [inputRef]: inputValue
                };
                const objectToStore = Object.assign({}, retrievedObject, cart);
                localStorage.setItem("cart", JSON.stringify(objectToStore));
                let sum = 0;
                for (const key in objectToStore) {
                    sum += parseInt(objectToStore[key])
                }
                $('#cartCount').text(sum)
                Toastify({
                    text: "Ajouté au devis !",
                    duration: 1500,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }
        });
        $(".btnOpenCart").click(function(event) {
            const cart = JSON.parse(localStorage.getItem("cart"));
            let items = '';
            for (const key in cart) {
                items += '<li><button id="' + key + '" class="btn btn-xs btn-outline-danger deleteCartLine"><i class="fas fa-trash"/></button>' + cart[key] + 'x <strong>' + key + '</strong></li>';
            }

            $('.recapCart').html(items);
        });
        $('.recapCart').on('click', '.deleteCartLine', function(event) {
            const inputRef = $(this).attr('id');
            const cart = JSON.parse(localStorage.getItem("cart"));
            delete cart[inputRef];
            localStorage.setItem("cart", JSON.stringify(cart));
            let sum = 0;
            for (const key in cart) {
                sum += parseInt(cart[key])
            }
            $('#cartCount').text(sum);
            $(this).parent().remove();
        });

        $("#addDevisButton").click(function(event) {
            event.preventDefault();
            const fields = [
                'nomEtab',
                'CP',
                'Email',
                'SIRET',
                'VILLE',
                'tel',
                'taille',
                'adresse',
                'nomResp',
                'prenomResp',
                'Fonction',
                'nomInstall',
                'prenomInstall',
                'EmailInstall',
                'adresseTraveaux',
                'telResponsable',
                'message',
                'calorifugeage',
            ];
            const errorFields = fields.map(field => $(`#${field}Error`));
            errorFields.forEach(field => {
                field.hide().parent().parent().attr('class', 'form-group has-success');
            });
            let url = (MAINCONTENT + "Devis/Add_Devis");
            const formData = fields.reduce((obj, field) => {
                obj[field] = $(`#${field}`).val();
                return obj;
            }, {});
            formData.calorifugeage = $('input[name="calorifugeage"]:checked').val();
            formData.cart = JSON.stringify(localStorage.getItem("cart"))

            $.ajax({
                url,
                type: 'POST',
                data: formData,
                success: function(msg) {
                    let json = $.parseJSON(msg);
                    if (json.verify) {
                        localStorage.setItem("cart", JSON.stringify({}));
                        $('#cartCount').text('')
                        $('.cartModal').modal('toggle');
                        Toastify({
                            text: "Merci, votre commande a bien été envoyée. Vous allez recevoir une copie par email.",
                            position: "center",
                            duration: 5500,
                            style: {
                                background: "linear-gradient(to right, #00b09b, #96c93d)",
                            }
                        }).showToast();
                    } else {
                        fields.forEach(field => {
                            if (json[field]) {
                                $(`#${field}Error`).html(json[field]);
                                $(`#${field}Error`).parent().parent().attr('class', 'form-group has-error');
                                $(`#${field}Error`).show();
                            }
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown, msg) {
                    $('#GeneralError').html(`Erreur: ${errorThrown}<br>${msg}`)
                        .parent().attr('class', 'form-group has-error')
                        .show();
                }
            });
        });



        //===== Search

        $('.search-open').on('click', function() {
            $('.search-box').addClass('open')
        });

        $('.search-close-btn').on('click', function() {
            $('.search-box').removeClass('open')
        });

        //===== Shopping Cart

        $('.amm-shopping-cart-open').on('click', function() {
            $('.amm-shopping-cart-canvas').addClass('open')
            $('.overlay').addClass('open')
        });

        $('.amm-shopping-cart-close').on('click', function() {
            $('.amm-shopping-cart-canvas').removeClass('open')
            $('.overlay').removeClass('open')
        });
        $('.overlay').on('click', function() {
            $('.amm-shopping-cart-canvas').removeClass('open')
            $('.overlay').removeClass('open')
        });









        /*---canvas menu activation---*/
        $('.canvas_open').on('click', function() {
            $('.offcanvas_menu_wrapper,.off_canvars_overlay').addClass('active')
        });

        $('.canvas_close,.off_canvars_overlay').on('click', function() {
            $('.offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active')
        });

        /*---Off Canvas Menu---*/
        var $offcanvasNav = $('.offcanvas_main_menu'),
            $offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu');
        $offcanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="fa fa-angle-down"></i></span>');

        $offcanvasNavSubMenu.slideUp();

        $offcanvasNav.on('click', 'li a, li .menu-expand', function(e) {
            var $this = $(this);
            if (($this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand'))) {
                e.preventDefault();
                if ($this.siblings('ul:visible').length) {
                    $this.siblings('ul').slideUp('slow');
                } else {
                    $this.closest('li').siblings('li').find('ul:visible').slideUp('slow');
                    $this.siblings('ul').slideDown('slow');
                }
            }
            if ($this.is('a') || $this.is('span') || $this.attr('clas').match(/\b(menu-expand)\b/)) {
                $this.parent().toggleClass('menu-open');
            } else if ($this.is('li') && $this.attr('class').match(/\b('menu-item-has-children')\b/)) {
                $this.toggleClass('menu-open');
            }
        });


        //===== product quantity

        $('.add').click(function() {
            if ($(this).prev().val()) {
                $(this).prev().val(+$(this).prev().val() + 1);
            }
        });
        $('.sub').click(function() {
            if ($(this).next().val() > 0) {
                if ($(this).next().val() > 0) $(this).next().val(+$(this).next().val() - 1);
            }
        });

    });


})(jQuery);