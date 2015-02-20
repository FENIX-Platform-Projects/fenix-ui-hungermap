define([
    'jquery',
    'text!hungermap/index.html',
    'bootstrap',
    //'fenix-map',
    'fenix-ui-map'
], function ($, template) {

    var global = this;
    global.FMHungerMap = function() {

        var CONFIG = {
            lang: 'EN',
            placeholder: 'main_content_placeholder',
            url_geoserver_wms: 'http://fenix.fao.org/geoserver',
            year: '2014',
            layer_hungermap: 'hungermap',
            layer_gaul0: 'gaul0_faostat_3857',
            layer_boundaries: 'gaul0_line_3857'
        }

        var build = function(config) {
            CONFIG = $.extend(true, {}, CONFIG, config);
            $('#' + CONFIG.placeholder).html(template);
            build_gui();
        }

        var build_gui = function() {
            var fenixMap = create_map('hm-map');
            var l = create_layer(fenixMap,CONFIG.lang, CONFIG.year)
            add_boundaries(fenixMap)

            //add labels
            add_labels(CONFIG.lang)

            $(".fx-ul li").on('click', {l: l, m: fenixMap}, function(event) {

                var $li =  $(event.currentTarget)

                $(".fx-ul li").removeClass('active')
                $li.addClass('active')
                console.log($li.find('a').attr('data-year'))
                CONFIG.year = $li.find('a').attr('data-year')
//                console.log(CONFIG.year)
//
//                $('.hm-timeline-selected').removeClass('hm-timeline-selected');
//                $(this).addClass('hm-timeline-selected');
                event.data.m.map.closePopup()
                switch_layer(event.data.l, CONFIG.year)
            });

            fenixMap.map.on('click', function (e) {
                getFeatureInfo(e, fenixMap, l, CONFIG.year, CONFIG.lang);
            });
        }

        var add_labels = function(lang) {
            switch(lang) {
                case 'FR':
                    $('#hm-proportion').html('Proportion de la');
                    $('#hm-title').html('Population Totale sous-alimentée');
                    $('#hm-timeline-title').html('Chronologie');
                    $('#hm-legend').html('Légende');
                    $('#hm-verylow').html('Très basse ');
                    $('#hm-moderatelylow').html('Modérément basse');
                    $('#hm-moderatelyhigh').html('Modérément élevée');
                    $('#hm-high').html('Élevée')
                    $('#hm-veryhigh').html('Très élevée')
                    $('#hm-missing').html('Données manquantes ou insuffisantes')
                    $('#hm-andover').html('et plus')
                    break;
                case 'ES':
                    $('#hm-proportion').html('Proporción de la');
                    $('#hm-title').html('Población Total Sub-alimentada');
                    $('#hm-timeline-title').html('Cronología');
                    $('#hm-legend').html('Leyenda');
                    $('#hm-verylow').html('Muy bajo');
                    $('#hm-moderatelylow').html('Moderadamente bajo');
                    $('#hm-moderatelyhigh').html('Moderadamente alto');
                    $('#hm-high').html('Alto')
                    $('#hm-veryhigh').html('Muy alto ')
                    $('#hm-missing').html('Información ausente o insuficiente')
                    $('#hm-andover').html('o más')
                    break;
                default:
                    $('#hm-proportion').html('Proportion Of');
                    $('#hm-title').html('Total Population Undernourished');
                    $('#hm-timeline-title').html('Timeline');
                    $('#hm-legend').html('Legend');
                    $('#hm-verylow').html('Very low');
                    $('#hm-moderatelylow').html('Moderately low');
                    $('#hm-moderatelyhigh').html('Moderately high');
                    $('#hm-high').html('High')
                    $('#hm-veryhigh').html('Very high')
                    $('#hm-missing').html('Missing or insufficient data')
                    $('#hm-andover').html('and over')
            }
            $("#hm-logo").addClass('hm-logo-' + lang);
        }

        var create_map =function (id) {
            var options = {
                plugins: {
                    zoomControl: 'bottomright'
                },
                guiController: {
                    overlay: false,
                    baselayer: false,
                    wmsLoader: false,
                    enablegfi: false
                },
                gui: {
                    disclaimerfao: false,
                    fullscreen: false
                },
                usedefaultbaselayers : false
            }

            var fenixMap = new FM.Map(id, options, {  minZoom: 1,  zoom: 1, zoomControl: false, attributionControl: false });
            fenixMap.createMap(25, 0, 2);
            fenixMap.addTileLayer(FM.TileLayer.createBaseLayer('ESRI_WORLDSTREETMAP', 'EN'), true);
            fenixMap.map.options.maxZoom = 9;
            fenixMap.map.options.minZoom = 2;
            return fenixMap;
        }

        var create_layer = function(fenixMap, lang, year) {
            var layer = {};
            layer.layertitle = 'Hunger Map'
            layer.layers = CONFIG.layer_hungermap;
            layer.urlWMS = CONFIG.url_geoserver_wms;
            layer.styles = 'hungermap_' + year;
            layer.defaultgfi = true;
            var l = new FM.layer(layer);
            l = setPopup(l, year, lang);
            fenixMap.addLayer(l)
            return l;
        }

        var setPopup = function(l,  year, lang) {
            l.layer.popuptitle = "adm0_name";
            l.layer.popuppercentage = "u_" + lang.toLocaleLowerCase() + "_" + year;
            var joinlabel  = "<div class='hm-popup-title'>{{" +  l.layer.popuptitle +"}}</div>";
            l.layer.customgfi = {
                content : {
                    en: "<div class='hm-popup-content'>" + joinlabel + "<div class='hm-popup-values'>{{" + l.layer.popuppercentage +"}} <i></i></div></div>"
                }
                ,showpopup: true
            }
            return l
        }

        var getFeatureInfo = function(e, fenixMap, l, year, lang) {
            l = setPopup(l, year, lang);
            FM.SpatialQuery.getFeatureInfoStandard(l, e.layerPoint, e.latlng, fenixMap.map);
        }

        var switch_layer = function(l, year) {
            l.layer.styles = 'hungermap_' + year;
            l.redraw();
        }

        var add_boundaries = function(fenixMap) {
            var layer = {};
            layer.layertitle = 'Hunger Map'
            layer.layers = CONFIG.layer_boundaries;
            layer.urlWMS = CONFIG.url_geoserver_wms;
            var l = new FM.layer(layer);
            fenixMap.addLayer(l)
            return l;
        }

        return {
            build: build
        };
    };
});
