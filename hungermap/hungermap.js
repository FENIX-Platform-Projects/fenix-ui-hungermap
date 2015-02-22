define([
    'jquery',
    'text!hungermap/index.html',
    'bootstrap',
    //'fenix-map',
    'fenix-ui-map',
    'jquery.hoverIntent',
    'Polyline.encoded',
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
            //add_labels(CONFIG.lang)

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

            // On Move
            var _m = fenixMap;
            var GFIchk = {};
            GFIchk["lat-" + fenixMap.id] = 0;
            GFIchk["lng-" + fenixMap.id] = 0;
            GFIchk["globalID-" + fenixMap.id] = 0;
            fenixMap.map.on('mousemove', function (e) {
                var id = Date.now();
                GFIchk["globalID-" + _m.id] = id;
                var t = setTimeout(function() {
                    if ( id == GFIchk["globalID-" + _m.id]) {
                        //console.log(e);
                        if ((GFIchk["lat-" + _m.id] != e.latlng.lat) && (GFIchk["lng-" + _m.id] != e.latlng.lng)) {
                            GFIchk["lat-" + _m.id] = e.latlng.lat;
                            GFIchk["lng-" + _m.id] = e.latlng.lng;
                            // call callback
                           // _m.getFeatureInfo(e, 'hm-value');
                            getFeatureInfo(e, fenixMap, l, CONFIG.year, CONFIG.lang);
                            //_m.getFeatureInfo(e);
                        }
                    }
                }, 50);
            });

            fenixMap.map.on('mouseout', function (e) {
                GFIchk["lat-" + fenixMap.id] = 0;
                GFIchk["lng-" + fenixMap.id] = 0;
                GFIchk["globalID-" + fenixMap.id] = 0;
                $('#hm-value').empty();
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
            fenixMap.createMap(35, 0, 2);

            //http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/5/18/19

            //fenixMap.addTileLayer(FM.TileLayer.createBaseLayer('ESRI_WORLDSTREETMAP', 'EN'), true);
            //fenixMap.addTileLayer(FM.TileLayer.createBaseLayer('ESRI_WORLDSTREETMAP', 'EN'), true);
            var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 18
            });

            var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
                maxZoom: 13
            });

            var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                maxZoom: 16
            });

            var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            });



            var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });

            var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            });

            var Acetate_labels = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-labels/{z}/{x}/{y}.png', {
                attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
                subdomains: '0123',
                minZoom: 2,
                maxZoom: 18,
                zIndex: 1000
        });

            var Stamen_TonerLabels = L.tileLayer('http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abcd',
                minZoom: 0,
                maxZoom: 20,
                opacity: 0.6,
                zIndex: 1000
            });


            fenixMap.map.addLayer(Esri_OceanBasemap);
            //fenixMap.map.addLayer(Stamen_TonerLabels);
            fenixMap.map.options.maxZoom = 9;
            fenixMap.map.options.minZoom = 2;
            //
            //fenixMap.map.on('click', function (e) {
            //    // customGFI
            //    var fenixMap = e.target._fenixMap;
            //    var l = fenixMap.controller.selectedLayer;
            //
            //});
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
                //content : {
                //    en: "<div class='hm-popup-content'>" + joinlabel + "<div class='hm-popup-values'>{{" + l.layer.popuppercentage +"}} <i></i></div></div>"
                //}
                content : {
                    en: "{{adm0_code}}|{{"+ l.layer.popuptitle + "}}|{{" + l.layer.popuppercentage+ "}}"
                }
                ,showpopup: false
                ,callback: function(response, l) {
                    response = response.split("|");
                    var percentage = isNaN(response[0]) == "missing or insufficient data"? "": " %";
                    var div = "<div class='hm-popup-conent'>" + response[1];
                    div += "<div class='hm-popup-values'><i>" + response[2] + percentage +"</i></div>";
                    div += "</div>";

                    $('#hm-value').empty();
                    $('#hm-value').append(div);
                }
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
