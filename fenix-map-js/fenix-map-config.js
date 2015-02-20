FMCONFIG = {

    // fenix-maps-js config variables
    BASEURL: 'http://fenix.fao.org/hungermap/fenix-map-js',

    //BASEURL_DEPENDENCIES: 'config/DEPENDENCIES.json',
    BASEURL_LANG: 'http://fenix.fao.org/hungermap/I18N/',

    // MAPS Servicies config variables
    BASEURL_MAPS: 'http://fenixapps2.fao.org/maps-demo',
    DEFAULT_WMS_SERVER: 'http://fenixapps2.fao.org/geo',

    // BASEURL_MAPS: 'fenixapps.fao.org/maps',
    MAP_SERVICE_SHADED: '/rest/service/sld2',
    MAP_SERVICE_POINT:  '/rest/service/sld2',
    MAP_SERVICE_GFI_JOIN: '/rest/service/joingfi',
    MAP_SERVICE_GFI_STANDARD: '/rest/service/request',
    MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
    MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',
    MAP_SERVICE_PROXY: '/rest/service/request',

    MAP_SERVICE_WPS_HISTOGRAM: '/rest/wps/hist',

    /** WDS configuration **/
    BASEURL_WDS: 'http://fenixapps.fao.org/wds',
    WDS_SERVICE_SPATIAL_QUERY: '/rest/geo/sq',

    // Map Store
    D3SP_SERVICE_SAVEMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/dataset/',
    D3SP_SERVICE_LOADMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/',


    // PGEO

    WPS_SERVICE_STATS: 'http://fenixapps2.fao.org/stats/raster/',
    WPS_SERVICE_HISTOGRAM: 'http:/fenixapps2.fao.org/stats/raster/{{ID}}/hist/',

    METADATA_GET_LAYERS: 'http://fenixapps2.fao.org/search/layer/',
    METADATA_GET_LAYERS_BY_PRODUCT: 'http://fenixapps2.fao.org/search/layer/product/'

};
