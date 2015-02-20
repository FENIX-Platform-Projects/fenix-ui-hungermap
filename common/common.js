requirejs.config({

    baseUrl: '',

    paths: {
        'bootstrap': 'http://netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min',
        'jquery': 'node_modules/jquery/dist/jquery.min',
        'text': 'node_modules/text/text',
        'domReady':  'node_modules/domReady/domReady',

        // fenix-map-js
        //'import-dependencies':'http://fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
        'leaflet':   'node_modules/leaflet/dist/leaflet',
        'jquery.power.tip':   'node_modules/jquery-powertip/dist/jquery.powertip.min',
        //'jquery-ui':   'http://fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties':   'http://fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        //'jquery.hoverIntent':   'http://fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',

        'fenix-map': 'fenix-map-js/fenix-map-min',
        'fenix-map-config': 'fenix-map-js/fenix-map-config',
        'FMHungerMap': 'hungermap/hungermap'
    },

    shim: {
        bootstrap: ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'fenix-map': {
            deps: ['jquery',
                'leaflet',
                //'jquery-ui',
                'fenix-map-config', 
	       // 'import-dependencies',
                'jquery.power.tip', 
                'jquery.i18n.properties',
                //'jquery.hoverIntent', 
                 //'chosen'
            ]
        }
    }
});
