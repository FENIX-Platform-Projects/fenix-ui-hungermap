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

            $(".fx-ul li").on('click', {l: l, m: fenixMap}, function(event) {
                var $li =  $(event.currentTarget)
                $(".fx-ul li").removeClass('active')
                $li.addClass('active')
                CONFIG.year = $li.find('a').attr('data-year')
                event.data.m.map.closePopup()
                switch_layer(event.data.l, CONFIG.year)
            });

            fenixMap.map.on('click', function (e) {
                getFeatureInfo(e, fenixMap, l, CONFIG.year, CONFIG.lang);
            });
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

            var fenixMap = new FM.Map(id, options,
                {
                   minZoom: 1,
                   maxZoom: 11,
                    zoomControl: false,
                    attributionControl: false,
                    continuousWorld: true,
                    maxBounds:[[-90, -180*10], [90, 180*10]]
                }
            );

            fenixMap.createMap();
            //fenixMap.createMap(20, 0, 1);

            var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
                maxZoom: 13
            });

            fenixMap.map.addLayer(Esri_OceanBasemap);
            //fenixMap.map.addLayer(Stamen_TonerLabels);
           // fenixMap.map.options.maxZoom = 9;
          //  fenixMap.map.options.minZoom = 2;
          //  var southWest = L.latLng(180, -180),
          //      northEast = L.latLng(90, -90),
          //      bounds = L.latLngBounds(southWest, northEast);
          //  fenixMap.map.options.maxBounds = bounds;

            //fenixMap.map.fitWorld();
            fenixMap.map.fitBounds([[-80, -175], [80, 175]]);
            fenixMap.map.invalidateSize();
            return fenixMap;
        }

        var create_layer = function(fenixMap, lang, year) {
            var layer = {};
            layer.layertitle = 'Hunger Map'
            layer.layers = CONFIG.layer_hungermap;
            layer.urlWMS = CONFIG.url_geoserver_wms;
            layer.styles = 'hungermap_' + year;
            layer.opacity = 0.8;
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
