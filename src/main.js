// ==UserScript==
// @name         URL minimizer
// @namespace    https://github.com/GottZ/url-minimizer
// @version      0.0.2
// @description  shorten url's to their minimum representation for better sharing without tracking information
// @author       GottZ
// @include      /^https?:\/\/(www\.)?(amazon|ebay|youtube)\.[a-z]+/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gottz.de
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-idle
// @updateURL    https://github.com/GottZ/url-minimizer/releases/latest/download/script.user.js
// @installURL   https://github.com/GottZ/url-minimizer/releases/latest/download/script.user.js
// @downloadURL  https://github.com/GottZ/url-minimizer/releases/latest/download/script.user.js
// ==/UserScript==

'use strict';



const sites = {
    // https://www.amazon.de/foo-bar-title-text/dp/DEADBEEFXX/?_encoding=UTF8&pd_rd_w=fb8hu&pf_rd_p=36ac740c-086e-4be7-777b-dd7777c777a7&pf_rd_r=1AA11A111A1A1A1AA1AA&pd_rd_r=931b8c66-31a1-4903-b777-7ba7787bb7a7&pd_rd_wg=AA7AA&ref_=pd_gw_ci_mcx_mi&th=1
    amazon: {
        host: /\b(amazon\.[a-z]+)$/,
        path: /dp\/([^\/]+)(?:\/|$)/,
        template: ({host, path}) => `https://${host[1]}/dp/${path[1]}`,
    },
    // https://www.ebay.de/itm/234567890123?_trkparms=aaaaaaaa%3DITM%26aaa%3D111111%26algo%3DPERSONAL.TOPIC%26ao%3D1%26asc%3D22222222222222%26meid%3Dd11be111a1111aa1aa11cf1111c11111%26pid%3D111111%26rk%3D1%26rkt%3D1%26itm%3D234567890123%26pmt%3D1%26noa%3D1%26pg%3D1111111%26algv%3DPersonalizedTopicsV2WithMetaOrganicPRecall&_trksid=p1111111.c111111.m11111&_trkparms=pageci%3Ac11111ab-bc11-11ec-bd11-4adce1e1111d%7Cparentrq%3A1c1f11d11111acb1ab111111ffff1e11%7Ciid%3A1
    ebay: {
        host: /\b(ebay\.[a-z]+)$/,
        path: /itm\/(\d+)/,
        template: ({host, path}) => `https://${host[1]}/itm/${path[1]}`,
    },
    // https://www.youtube.com/watch?v=RCJdPiogUIk
    youtube: {
        host: /\b(youtube\.[a-z]+)$/,
        search: /\bv=([\w\-\_]+)/,
        template: ({search}) => `https://youtu.be/${search[1]}`,
    }
};

const minimize = () => {
    let success = false;
    for (let name in sites) {
        const site = sites[name];
        if (!site.host.test(location.hostname)) continue;
        if ("path" in site && !site.path.test(location.pathname)) continue;
        if ("search" in site && !site.search.test(location.search)) continue;

        const host = site.host.exec(location.hostname);
        const path = "path" in site ? site.path.exec(location.pathname) : null;
        const search = "search" in site ? site.search.exec(location.search) : null;

        const link = site.template({host, path, search});

        prompt(`copy this ${name} link`, link);
        success = true;
        break;
    }

    if (!success) alert("could not shorten this url");
};

GM_registerMenuCommand("minimize", minimize);
