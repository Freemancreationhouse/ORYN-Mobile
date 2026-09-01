(function(){
'use strict';
const BUILD='ORYN-ANDROID-V10.4.1-DIRECT-PLAYBACK-STATE-FIX-20260901-1';
const OFFLINE_ID='oryn-mobile-offline';
const DIRECT_ID='oryn-direct-fluidnc';
const DIRECT_AUTO_HOME_PENDING='oryn_direct_auto_home_pending_v1';
const CATALOG=[{"path":"0-0-rotating-hearts.thr","name":"0-0-rotating-hearts","category":"root","date_modified":1787850168.0,"coordinates_count":22539,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":100.531,"y":0.0},"thr_url":"/offline/patterns/7b39059c4a04c068.thr","preview_url":"/offline/previews/7b39059c4a04c068.webp"},{"path":"0-1-hubcap.thr","name":"0-1-hubcap","category":"root","date_modified":1787850169.0,"coordinates_count":36393,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-30.199,"y":1.0},"thr_url":"/offline/patterns/a86541f12e4ee46f.thr","preview_url":"/offline/previews/a86541f12e4ee46f.webp"},{"path":"03 pnuttrellis (E) (N N).thr","name":"03 pnuttrellis (E) (N N)","category":"root","date_modified":1787850168.0,"coordinates_count":31818,"first_coordinate":{"x":-0.001,"y":1.0},"last_coordinate":{"x":615.566,"y":0.991},"thr_url":"/offline/patterns/89e177bf3d0027e4.thr","preview_url":"/offline/previews/89e177bf3d0027e4.webp"},{"path":"1-1-ibex.thr","name":"1-1-ibex","category":"root","date_modified":1787850168.0,"coordinates_count":79278,"first_coordinate":{"x":0.778,"y":1.0},"last_coordinate":{"x":0.604,"y":1.0},"thr_url":"/offline/patterns/ea58ff0fcc67e86d.thr","preview_url":"/offline/previews/ea58ff0fcc67e86d.webp"},{"path":"1-1-pizza-slice-swirl.thr","name":"1-1-pizza-slice-swirl","category":"root","date_modified":1787850169.0,"coordinates_count":66761,"first_coordinate":{"x":-2.386,"y":1.0},"last_coordinate":{"x":224.416,"y":1.0},"thr_url":"/offline/patterns/24cc6842c4e76542.thr","preview_url":"/offline/previews/24cc6842c4e76542.webp"},{"path":"10_sided_polygon.thr","name":"10_sided_polygon","category":"root","date_modified":1787850168.0,"coordinates_count":5611,"first_coordinate":{"x":1.257,"y":0.033},"last_coordinate":{"x":-206.421,"y":0.99},"thr_url":"/offline/patterns/3cea02bf081b046c.thr","preview_url":"/offline/previews/3cea02bf081b046c.webp"},{"path":"13b Battlesbury (C C).thr","name":"13b Battlesbury (C C)","category":"root","date_modified":1787850168.0,"coordinates_count":9100,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-154.314,"y":0.003},"thr_url":"/offline/patterns/92b30944d3989864.thr","preview_url":"/offline/previews/92b30944d3989864.webp"},{"path":"19 Itsyourmove (E) (C NW).thr","name":"19 Itsyourmove (E) (C NW)","category":"root","date_modified":1787850168.0,"coordinates_count":44661,"first_coordinate":{"x":3.142,"y":1.0},"last_coordinate":{"x":-677.38,"y":0.99},"thr_url":"/offline/patterns/617b54a90e457f1a.thr","preview_url":"/offline/previews/617b54a90e457f1a.webp"},{"path":"6_sided_polygon.thr","name":"6_sided_polygon","category":"root","date_modified":1787850168.0,"coordinates_count":7813,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-270.754,"y":0.991},"thr_url":"/offline/patterns/ff76078e034308fa.thr","preview_url":"/offline/previews/ff76078e034308fa.webp"},{"path":"AcklingDykeDorset 6-4-2018.thr","name":"AcklingDykeDorset 6-4-2018","category":"root","date_modified":1787850168.0,"coordinates_count":3496,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-98.96,"y":0.0},"thr_url":"/offline/patterns/f872a6ac316ba819.thr","preview_url":"/offline/previews/f872a6ac316ba819.webp"},{"path":"BattlesburyCampWilts 7-5-2017.thr","name":"BattlesburyCampWilts 7-5-2017","category":"root","date_modified":1787850168.0,"coordinates_count":7417,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-157.08,"y":0.0},"thr_url":"/offline/patterns/e9d943a218da6398.thr","preview_url":"/offline/previews/e9d943a218da6398.webp"},{"path":"BucklandDownDorset 5-26-2018.thr","name":"BucklandDownDorset 5-26-2018","category":"root","date_modified":1787850168.0,"coordinates_count":14933,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-85.47,"y":0.0},"thr_url":"/offline/patterns/6f7262900f0afde0.thr","preview_url":"/offline/previews/6f7262900f0afde0.webp"},{"path":"chartres_labyrinthe.thr","name":"chartres_labyrinthe","category":"root","date_modified":1787850167.0,"coordinates_count":7802,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-43.937,"y":0.0},"thr_url":"/offline/patterns/885fcdadf980b7e4.thr","preview_url":"/offline/previews/885fcdadf980b7e4.webp"},{"path":"circle-packer-rings.thr","name":"circle-packer-rings","category":"root","date_modified":1787850168.0,"coordinates_count":53630,"first_coordinate":{"x":-1.139,"y":1.0},"last_coordinate":{"x":-3.83,"y":1.0},"thr_url":"/offline/patterns/6e303853270ecf5a.thr","preview_url":"/offline/previews/6e303853270ecf5a.webp"},{"path":"circle_normalized.thr","name":"circle_normalized","category":"root","date_modified":1787850168.0,"coordinates_count":198,"first_coordinate":{"x":0.0,"y":1.0},"last_coordinate":{"x":6.251,"y":1.0},"thr_url":"/offline/patterns/cc506fe2f8634a3c.thr","preview_url":"/offline/previews/cc506fe2f8634a3c.webp"},{"path":"clear_from_in.thr","name":"clear_from_in","category":"root","date_modified":1787850168.0,"coordinates_count":3449,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-205.682,"y":1.0},"thr_url":"/offline/patterns/ffdf5ef9d3979a9a.thr","preview_url":"/offline/previews/ffdf5ef9d3979a9a.webp"},{"path":"clear_from_in_mini.thr","name":"clear_from_in_mini","category":"root","date_modified":1787850169.0,"coordinates_count":10152,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-124.0929,"y":1.0},"thr_url":"/offline/patterns/e75d083323dfdbb8.thr","preview_url":"/offline/previews/e75d083323dfdbb8.webp"},{"path":"clear_from_in_pro.thr","name":"clear_from_in_pro","category":"root","date_modified":1787850168.0,"coordinates_count":7327,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-292.168,"y":1.0},"thr_url":"/offline/patterns/aee422db78902ab6.thr","preview_url":"/offline/previews/aee422db78902ab6.webp"},{"path":"clear_from_in_Ultra.thr","name":"clear_from_in_Ultra","category":"root","date_modified":1787850168.0,"coordinates_count":96957,"first_coordinate":{"x":5.97335,"y":0.00629},"last_coordinate":{"x":999.0,"y":1.0},"thr_url":"/offline/patterns/ddabcbba81c66c30.thr","preview_url":"/offline/previews/ddabcbba81c66c30.webp"},{"path":"clear_from_out.thr","name":"clear_from_out","category":"root","date_modified":1787850168.0,"coordinates_count":3447,"first_coordinate":{"x":0.0,"y":1.0},"last_coordinate":{"x":207.253,"y":0.001},"thr_url":"/offline/patterns/3e2636755d7c94db.thr","preview_url":"/offline/previews/3e2636755d7c94db.webp"},{"path":"clear_from_out_mini.thr","name":"clear_from_out_mini","category":"root","date_modified":1787850168.0,"coordinates_count":9946,"first_coordinate":{"x":1.5708,"y":1.0},"last_coordinate":{"x":125.6637,"y":0.0},"thr_url":"/offline/patterns/97ba9736bfea3606.thr","preview_url":"/offline/previews/97ba9736bfea3606.webp"},{"path":"clear_from_out_pro.thr","name":"clear_from_out_pro","category":"root","date_modified":1787850169.0,"coordinates_count":7329,"first_coordinate":{"x":0.0,"y":1.0},"last_coordinate":{"x":292.087,"y":0.0},"thr_url":"/offline/patterns/374a8d33ff1a9aea.thr","preview_url":"/offline/previews/374a8d33ff1a9aea.webp"},{"path":"clear_from_out_Ultra.thr","name":"clear_from_out_Ultra","category":"root","date_modified":1787850168.0,"coordinates_count":93058,"first_coordinate":{"x":-6.28,"y":1.0},"last_coordinate":{"x":999.99508,"y":0.0},"thr_url":"/offline/patterns/f033a57fffdb527d.thr","preview_url":"/offline/previews/f033a57fffdb527d.webp"},{"path":"clear_sideway.thr","name":"clear_sideway","category":"root","date_modified":1787850168.0,"coordinates_count":4175,"first_coordinate":{"x":-2.356,"y":1.0},"last_coordinate":{"x":-5.187,"y":0.997},"thr_url":"/offline/patterns/eb241c88d738cbfc.thr","preview_url":"/offline/previews/eb241c88d738cbfc.webp"},{"path":"clear_sideway_mini.thr","name":"clear_sideway_mini","category":"root","date_modified":1787850168.0,"coordinates_count":4175,"first_coordinate":{"x":-2.356,"y":1.0},"last_coordinate":{"x":-5.187,"y":0.997},"thr_url":"/offline/patterns/1799b6aadd43b92a.thr","preview_url":"/offline/previews/1799b6aadd43b92a.webp"},{"path":"clear_sideway_pro.thr","name":"clear_sideway_pro","category":"root","date_modified":1787850168.0,"coordinates_count":8210,"first_coordinate":{"x":3.142,"y":1.0},"last_coordinate":{"x":6.283,"y":1.0},"thr_url":"/offline/patterns/24665ad2699d39b7.thr","preview_url":"/offline/previews/24665ad2699d39b7.webp"},{"path":"CleyHill 7-18-2017.thr","name":"CleyHill 7-18-2017","category":"root","date_modified":1787850168.0,"coordinates_count":11627,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-4.189,"y":0.586},"thr_url":"/offline/patterns/965c7cc9898243a1.thr","preview_url":"/offline/previews/965c7cc9898243a1.webp"},{"path":"dither_cells.thr","name":"dither_cells","category":"root","date_modified":1787850168.0,"coordinates_count":1489,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":134.216,"y":1.0},"thr_url":"/offline/patterns/bd888db16f87e6ae.thr","preview_url":"/offline/previews/bd888db16f87e6ae.webp"},{"path":"dither_eccentricerase.thr","name":"dither_eccentricerase","category":"root","date_modified":1787850169.0,"coordinates_count":12309,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-398.442,"y":1.0},"thr_url":"/offline/patterns/3e6cba0166e361d5.thr","preview_url":"/offline/previews/3e6cba0166e361d5.webp"},{"path":"dither_gears.thr","name":"dither_gears","category":"root","date_modified":1787850168.0,"coordinates_count":2982,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":134.341,"y":1.0},"thr_url":"/offline/patterns/9e1f28a00dcc1bf8.thr","preview_url":"/offline/previews/9e1f28a00dcc1bf8.webp"},{"path":"dither_gosper4.thr","name":"dither_gosper4","category":"root","date_modified":1787850168.0,"coordinates_count":4781,"first_coordinate":{"x":0.323,"y":1.0},"last_coordinate":{"x":-3.895,"y":1.0},"thr_url":"/offline/patterns/11f11ccac3e6ab26.thr","preview_url":"/offline/previews/11f11ccac3e6ab26.webp"},{"path":"dither_hypnogrid.thr","name":"dither_hypnogrid","category":"root","date_modified":1787850168.0,"coordinates_count":13569,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-398.442,"y":1.0},"thr_url":"/offline/patterns/d0d5d6f2416e473e.thr","preview_url":"/offline/previews/d0d5d6f2416e473e.webp"},{"path":"dither_itsyourmove.thr","name":"dither_itsyourmove","category":"root","date_modified":1787850168.0,"coordinates_count":43834,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-692.153,"y":1.0},"thr_url":"/offline/patterns/eca5d2e07f4d14c3.thr","preview_url":"/offline/previews/eca5d2e07f4d14c3.webp"},{"path":"dither_nautilus.thr","name":"dither_nautilus","category":"root","date_modified":1787850168.0,"coordinates_count":6334,"first_coordinate":{"x":0.0,"y":1.0},"last_coordinate":{"x":0.0,"y":1.0},"thr_url":"/offline/patterns/daae958f00bf55fd.thr","preview_url":"/offline/previews/daae958f00bf55fd.webp"},{"path":"dither_parallel.thr","name":"dither_parallel","category":"root","date_modified":1787850168.0,"coordinates_count":7794,"first_coordinate":{"x":-3.142,"y":1.0},"last_coordinate":{"x":0.0,"y":1.0},"thr_url":"/offline/patterns/d47ca5f370e588d5.thr","preview_url":"/offline/previews/d47ca5f370e588d5.webp"},{"path":"dither_sierpinski8.thr","name":"dither_sierpinski8","category":"root","date_modified":1787850168.0,"coordinates_count":6562,"first_coordinate":{"x":-2.094,"y":1.0},"last_coordinate":{"x":2.094,"y":1.0},"thr_url":"/offline/patterns/694629f712a1e731.thr","preview_url":"/offline/previews/694629f712a1e731.webp"},{"path":"dither_strangthang.thr","name":"dither_strangthang","category":"root","date_modified":1787850168.0,"coordinates_count":37670,"first_coordinate":{"x":0.0,"y":1.0},"last_coordinate":{"x":-3.495,"y":1.0},"thr_url":"/offline/patterns/8be01a279c3cf83a.thr","preview_url":"/offline/previews/8be01a279c3cf83a.webp"},{"path":"dither_sunburst.thr","name":"dither_sunburst","category":"root","date_modified":1787850168.0,"coordinates_count":27463,"first_coordinate":{"x":1.571,"y":1.0},"last_coordinate":{"x":-193.208,"y":1.0},"thr_url":"/offline/patterns/6f7879699a14fa05.thr","preview_url":"/offline/previews/6f7879699a14fa05.webp"},{"path":"dither_tri4.thr","name":"dither_tri4","category":"root","date_modified":1787850167.0,"coordinates_count":12833,"first_coordinate":{"x":1.571,"y":1.0},"last_coordinate":{"x":-245.568,"y":1.0},"thr_url":"/offline/patterns/e7f3fec7f4ba7f23.thr","preview_url":"/offline/previews/e7f3fec7f4ba7f23.webp"},{"path":"dither_yinyang.thr","name":"dither_yinyang","category":"root","date_modified":1787850168.0,"coordinates_count":1118,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-1098.43,"y":1.0},"thr_url":"/offline/patterns/2501b31b028f21db.thr","preview_url":"/offline/previews/2501b31b028f21db.webp"},{"path":"even_sparser_sawtooth.thr","name":"even_sparser_sawtooth","category":"root","date_modified":1787850168.0,"coordinates_count":10800,"first_coordinate":{"x":-0.004,"y":1.0},"last_coordinate":{"x":66.449,"y":0.025},"thr_url":"/offline/patterns/f837d73befe561ca.thr","preview_url":"/offline/previews/f837d73befe561ca.webp"},{"path":"fancy-bars.thr","name":"fancy-bars","category":"root","date_modified":1787850168.0,"coordinates_count":23996,"first_coordinate":{"x":-1.204,"y":1.0},"last_coordinate":{"x":26.364,"y":1.0},"thr_url":"/offline/patterns/f2d0d9faef37eb97.thr","preview_url":"/offline/previews/f2d0d9faef37eb97.webp"},{"path":"fancy-tiles.thr","name":"fancy-tiles","category":"root","date_modified":1787850168.0,"coordinates_count":25273,"first_coordinate":{"x":-0.32,"y":1.0},"last_coordinate":{"x":-3.889,"y":1.0},"thr_url":"/offline/patterns/8e013b534325832e.thr","preview_url":"/offline/previews/8e013b534325832e.webp"},{"path":"feather.thr","name":"feather","category":"root","date_modified":1787850169.0,"coordinates_count":22690,"first_coordinate":{"x":-1.571,"y":1.0},"last_coordinate":{"x":-4.359,"y":1.0},"thr_url":"/offline/patterns/ba467c482200b07b.thr","preview_url":"/offline/previews/ba467c482200b07b.webp"},{"path":"flower-bubbles.thr","name":"flower-bubbles","category":"root","date_modified":1787850168.0,"coordinates_count":24737,"first_coordinate":{"x":2.765,"y":1.0},"last_coordinate":{"x":1.107,"y":0.704},"thr_url":"/offline/patterns/109e3c8a13bad4a5.thr","preview_url":"/offline/previews/109e3c8a13bad4a5.webp"},{"path":"flower.thr","name":"flower","category":"root","date_modified":1787850168.0,"coordinates_count":18746,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-19.13,"y":1.0},"thr_url":"/offline/patterns/4d4052cbbf7c311b.thr","preview_url":"/offline/previews/4d4052cbbf7c311b.webp"},{"path":"flowsnake.thr","name":"flowsnake","category":"root","date_modified":1787850168.0,"coordinates_count":3644,"first_coordinate":{"x":-0.948,"y":1.0},"last_coordinate":{"x":5.121,"y":1.0},"thr_url":"/offline/patterns/abdaa95d7803f018.thr","preview_url":"/offline/previews/abdaa95d7803f018.webp"},{"path":"Fractal.thr","name":"Fractal","category":"root","date_modified":1787850169.0,"coordinates_count":4137,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":7.854,"y":0.0},"thr_url":"/offline/patterns/c2b35316730de501.thr","preview_url":"/offline/previews/c2b35316730de501.webp"},{"path":"fractal2.thr","name":"fractal2","category":"root","date_modified":1787850169.0,"coordinates_count":8802,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-12.566,"y":0.0},"thr_url":"/offline/patterns/110fec2539a23ecb.thr","preview_url":"/offline/previews/110fec2539a23ecb.webp"},{"path":"HackpenHill 6-9-2018.thr","name":"HackpenHill 6-9-2018","category":"root","date_modified":1787850169.0,"coordinates_count":24765,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-196.355,"y":0.965},"thr_url":"/offline/patterns/d7a2cb0a6df081d9.thr","preview_url":"/offline/previews/d7a2cb0a6df081d9.webp"},{"path":"Hampton-on-Lucy 8-8-2015.thr","name":"Hampton-on-Lucy 8-8-2015","category":"root","date_modified":1787850167.0,"coordinates_count":11800,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":101.937,"y":0.0},"thr_url":"/offline/patterns/2ceb39a022c59f4f.thr","preview_url":"/offline/previews/2ceb39a022c59f4f.webp"},{"path":"hero_11loop2.thr","name":"hero_11loop2","category":"root","date_modified":1787850168.0,"coordinates_count":35323,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1413.139,"y":1.0},"thr_url":"/offline/patterns/117c27459ea0679b.thr","preview_url":"/offline/previews/117c27459ea0679b.webp"},{"path":"hero_13wave1.thr","name":"hero_13wave1","category":"root","date_modified":1787850168.0,"coordinates_count":62797,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1255.913,"y":1.0},"thr_url":"/offline/patterns/af71f8e1f82f45e7.thr","preview_url":"/offline/previews/af71f8e1f82f45e7.webp"},{"path":"hero_5loop1.thr","name":"hero_5loop1","category":"root","date_modified":1787850168.0,"coordinates_count":27473,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1098.9,"y":1.0},"thr_url":"/offline/patterns/b922876c98cec1f6.thr","preview_url":"/offline/previews/b922876c98cec1f6.webp"},{"path":"hero_7loop4.thr","name":"hero_7loop4","category":"root","date_modified":1787850168.0,"coordinates_count":62785,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1255.736,"y":1.0},"thr_url":"/offline/patterns/3034ed947e8b2e7f.thr","preview_url":"/offline/previews/3034ed947e8b2e7f.webp"},{"path":"hero_9wave2.thr","name":"hero_9wave2","category":"root","date_modified":1787850168.0,"coordinates_count":41877,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1256.397,"y":1.0},"thr_url":"/offline/patterns/8bb922e2f2950d4e.thr","preview_url":"/offline/previews/8bb922e2f2950d4e.webp"},{"path":"hexagoner.thr","name":"hexagoner","category":"root","date_modified":1787850168.0,"coordinates_count":17524,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-443.919,"y":0.99},"thr_url":"/offline/patterns/5afd222e0dab61da.thr","preview_url":"/offline/previews/5afd222e0dab61da.webp"},{"path":"Hosta.thr","name":"Hosta","category":"root","date_modified":1787850168.0,"coordinates_count":9587,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":111.231,"y":0.005},"thr_url":"/offline/patterns/a1ecc9d7d059675a.thr","preview_url":"/offline/previews/a1ecc9d7d059675a.webp"},{"path":"KeysleyDown 6-10-2018.thr","name":"KeysleyDown 6-10-2018","category":"root","date_modified":1787850168.0,"coordinates_count":8118,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":120.951,"y":0.0},"thr_url":"/offline/patterns/6fce0df5a7cad9da.thr","preview_url":"/offline/previews/6fce0df5a7cad9da.webp"},{"path":"koch-cube-flowers.thr","name":"koch-cube-flowers","category":"root","date_modified":1787850168.0,"coordinates_count":29354,"first_coordinate":{"x":-2.356,"y":1.0},"last_coordinate":{"x":3.53,"y":1.0},"thr_url":"/offline/patterns/7e5bbd533ffda3ff.thr","preview_url":"/offline/previews/7e5bbd533ffda3ff.webp"},{"path":"LiddingtonCastle 6-24-2001.thr","name":"LiddingtonCastle 6-24-2001","category":"root","date_modified":1787850168.0,"coordinates_count":18929,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-17.279,"y":1.0},"thr_url":"/offline/patterns/a61927fd9d39953c.thr","preview_url":"/offline/previews/a61927fd9d39953c.webp"},{"path":"LongwoodWarrenHants 7-10-2018.thr","name":"LongwoodWarrenHants 7-10-2018","category":"root","date_modified":1787850168.0,"coordinates_count":22221,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":6.815,"y":0.894},"thr_url":"/offline/patterns/6b87a41b46220ccd.thr","preview_url":"/offline/previews/6b87a41b46220ccd.webp"},{"path":"maze.thr","name":"maze","category":"root","date_modified":1787850168.0,"coordinates_count":3137,"first_coordinate":{"x":-2.356,"y":1.0},"last_coordinate":{"x":2.151,"y":1.0},"thr_url":"/offline/patterns/0ea09078d3486dd9.thr","preview_url":"/offline/previews/0ea09078d3486dd9.webp"},{"path":"MilkHill 6-2-2009.thr","name":"MilkHill 6-2-2009","category":"root","date_modified":1787850167.0,"coordinates_count":2121,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-73.827,"y":0.0},"thr_url":"/offline/patterns/d15de08a0417bc3a.thr","preview_url":"/offline/previews/d15de08a0417bc3a.webp"},{"path":"MilkHill 7-8-2011.thr","name":"MilkHill 7-8-2011","category":"root","date_modified":1787850169.0,"coordinates_count":5413,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":67.245,"y":1.0},"thr_url":"/offline/patterns/4a300d08ec30ad7c.thr","preview_url":"/offline/previews/4a300d08ec30ad7c.webp"},{"path":"Muncombe Hill 7-14-2018.thr","name":"Muncombe Hill 7-14-2018","category":"root","date_modified":1787850168.0,"coordinates_count":12432,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":23.12,"y":0.0},"thr_url":"/offline/patterns/5a3d67bad7b36335.thr","preview_url":"/offline/previews/5a3d67bad7b36335.webp"},{"path":"noise-cell.thr","name":"noise-cell","category":"root","date_modified":1787850168.0,"coordinates_count":37032,"first_coordinate":{"x":-2.37,"y":1.0},"last_coordinate":{"x":1.31,"y":1.0},"thr_url":"/offline/patterns/c2617fc325161857.thr","preview_url":"/offline/previews/c2617fc325161857.webp"},{"path":"noise-square-reversible.thr","name":"noise-square-reversible","category":"root","date_modified":1787850169.0,"coordinates_count":55581,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-367.633,"y":1.0},"thr_url":"/offline/patterns/eec7cdfbaad8e9ce.thr","preview_url":"/offline/previews/eec7cdfbaad8e9ce.webp"},{"path":"noise-star-reversible.thr","name":"noise-star-reversible","category":"root","date_modified":1787850168.0,"coordinates_count":46291,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-217.107,"y":1.0},"thr_url":"/offline/patterns/c195619b62357b2e.thr","preview_url":"/offline/previews/c195619b62357b2e.webp"},{"path":"OareWiltshire 6-21-2010.thr","name":"OareWiltshire 6-21-2010","category":"root","date_modified":1787850168.0,"coordinates_count":13951,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":30.936,"y":1.0},"thr_url":"/offline/patterns/e2d0b5fa976ca042.thr","preview_url":"/offline/previews/e2d0b5fa976ca042.webp"},{"path":"pattern-shapespin.thr","name":"pattern-shapespin","category":"root","date_modified":1787850168.0,"coordinates_count":13151,"first_coordinate":{"x":4.712,"y":0.842},"last_coordinate":{"x":-259.181,"y":0.842},"thr_url":"/offline/patterns/6654752921779b3b.thr","preview_url":"/offline/previews/6654752921779b3b.webp"},{"path":"pattern-superellipse.thr","name":"pattern-superellipse","category":"root","date_modified":1787850168.0,"coordinates_count":9164,"first_coordinate":{"x":3.142,"y":0.0},"last_coordinate":{"x":-186.925,"y":1.005},"thr_url":"/offline/patterns/4c5e7a825d357df6.thr","preview_url":"/offline/previews/4c5e7a825d357df6.webp"},{"path":"perlin-rings.thr","name":"perlin-rings","category":"root","date_modified":1787850168.0,"coordinates_count":42184,"first_coordinate":{"x":-2.313,"y":1.0},"last_coordinate":{"x":-12.566,"y":0.0},"thr_url":"/offline/patterns/6a5ea59f7176a5d9.thr","preview_url":"/offline/previews/6a5ea59f7176a5d9.webp"},{"path":"Petalar.thr","name":"Petalar","category":"root","date_modified":1787850168.0,"coordinates_count":7449,"first_coordinate":{"x":628.319,"y":1.0},"last_coordinate":{"x":786.969,"y":0.0},"thr_url":"/offline/patterns/2283c63e3bf99af9.thr","preview_url":"/offline/previews/2283c63e3bf99af9.webp"},{"path":"reuleaux.thr","name":"reuleaux","category":"root","date_modified":1787850168.0,"coordinates_count":18761,"first_coordinate":{"x":-2.203,"y":0.031},"last_coordinate":{"x":-299.043,"y":0.99},"thr_url":"/offline/patterns/0cb1abdc2c5f0164.thr","preview_url":"/offline/previews/0cb1abdc2c5f0164.webp"},{"path":"rose.thr","name":"rose","category":"root","date_modified":1787850168.0,"coordinates_count":16691,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-253.913,"y":1.0},"thr_url":"/offline/patterns/64f3115cbd1ed158.thr","preview_url":"/offline/previews/64f3115cbd1ed158.webp"},{"path":"rose_2.thr","name":"rose_2","category":"root","date_modified":1787850169.0,"coordinates_count":17576,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-177.486,"y":0.024},"thr_url":"/offline/patterns/d86a64d0aa80832f.thr","preview_url":"/offline/previews/d86a64d0aa80832f.webp"},{"path":"sawtooth.thr","name":"sawtooth","category":"root","date_modified":1787850168.0,"coordinates_count":13811,"first_coordinate":{"x":-0.005,"y":1.0},"last_coordinate":{"x":236.29,"y":0.007},"thr_url":"/offline/patterns/e143077d00b7a7cf.thr","preview_url":"/offline/previews/e143077d00b7a7cf.webp"},{"path":"shell (1).thr","name":"shell (1)","category":"root","date_modified":1787850168.0,"coordinates_count":49713,"first_coordinate":{"x":-2.23,"y":0.276},"last_coordinate":{"x":596.694,"y":0.859},"thr_url":"/offline/patterns/d03c66af1bd27b56.thr","preview_url":"/offline/previews/d03c66af1bd27b56.webp"},{"path":"sierpinski.thr","name":"sierpinski","category":"root","date_modified":1787850168.0,"coordinates_count":2597,"first_coordinate":{"x":2.337,"y":1.0},"last_coordinate":{"x":8.441,"y":0.991},"thr_url":"/offline/patterns/92f3a3c92e7ac575.thr","preview_url":"/offline/previews/92f3a3c92e7ac575.webp"},{"path":"SierpinskiTriangle (1).thr","name":"SierpinskiTriangle (1)","category":"root","date_modified":1787850168.0,"coordinates_count":2979,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":17.571,"y":0.0},"thr_url":"/offline/patterns/50a384efd07703e0.thr","preview_url":"/offline/previews/50a384efd07703e0.webp"},{"path":"SimpleRadiance.thr","name":"SimpleRadiance","category":"root","date_modified":1787850168.0,"coordinates_count":402,"first_coordinate":{"x":125.664,"y":0.2},"last_coordinate":{"x":615.752,"y":0.0},"thr_url":"/offline/patterns/47905eba1a9ccbd5.thr","preview_url":"/offline/previews/47905eba1a9ccbd5.webp"},{"path":"SineVsBezier2.thr","name":"SineVsBezier2","category":"root","date_modified":1787850168.0,"coordinates_count":3119,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":6.283,"y":0.0},"thr_url":"/offline/patterns/a999ac2f5551d2f9.thr","preview_url":"/offline/previews/a999ac2f5551d2f9.webp"},{"path":"Spiral6.thr","name":"Spiral6","category":"root","date_modified":1787850168.0,"coordinates_count":31925,"first_coordinate":{"x":-2.216,"y":0.006},"last_coordinate":{"x":842.055,"y":1.0},"thr_url":"/offline/patterns/d8dfd28ca11a4973.thr","preview_url":"/offline/previews/d8dfd28ca11a4973.webp"},{"path":"spiral_triangle.thr","name":"spiral_triangle","category":"root","date_modified":1787850169.0,"coordinates_count":58788,"first_coordinate":{"x":0.001,"y":1.0},"last_coordinate":{"x":570.161,"y":0.01},"thr_url":"/offline/patterns/eb2e62d46216d982.thr","preview_url":"/offline/previews/eb2e62d46216d982.webp"},{"path":"SpiralBezier (1).thr","name":"SpiralBezier (1)","category":"root","date_modified":1787850168.0,"coordinates_count":35047,"first_coordinate":{"x":2.82,"y":0.0},"last_coordinate":{"x":31.295,"y":0.998},"thr_url":"/offline/patterns/aa048df7abde4c22.thr","preview_url":"/offline/previews/aa048df7abde4c22.webp"},{"path":"SpiralGyrations-2.thr","name":"SpiralGyrations-2","category":"root","date_modified":1787850168.0,"coordinates_count":60236,"first_coordinate":{"x":3.142,"y":0.0},"last_coordinate":{"x":252.855,"y":0.996},"thr_url":"/offline/patterns/835b34f64790ef98.thr","preview_url":"/offline/previews/835b34f64790ef98.webp"},{"path":"Sponge.thr","name":"Sponge","category":"root","date_modified":1787850168.0,"coordinates_count":5276,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":7.854,"y":0.0},"thr_url":"/offline/patterns/d5110c09310ef95f.thr","preview_url":"/offline/previews/d5110c09310ef95f.webp"},{"path":"square.thr","name":"square","category":"root","date_modified":1787850168.0,"coordinates_count":1636,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-62.046,"y":0.098},"thr_url":"/offline/patterns/cf9e596410df4e20.thr","preview_url":"/offline/previews/cf9e596410df4e20.webp"},{"path":"square_erase2.thr","name":"square_erase2","category":"root","date_modified":1787850168.0,"coordinates_count":33225,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":1.545,"y":0.993},"thr_url":"/offline/patterns/ab1f86078614c63c.thr","preview_url":"/offline/previews/ab1f86078614c63c.webp"},{"path":"square_rotate.thr","name":"square_rotate","category":"root","date_modified":1787850168.0,"coordinates_count":6025,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-188.936,"y":0.992},"thr_url":"/offline/patterns/abbe4511495e562d.thr","preview_url":"/offline/previews/abbe4511495e562d.webp"},{"path":"star.thr","name":"star","category":"root","date_modified":1787850168.0,"coordinates_count":181,"first_coordinate":{"x":1.571,"y":0.313},"last_coordinate":{"x":-4.712,"y":0.313},"thr_url":"/offline/patterns/159151d1c674828a.thr","preview_url":"/offline/previews/159151d1c674828a.webp"},{"path":"StarryNight.thr","name":"StarryNight","category":"root","date_modified":1787850168.0,"coordinates_count":19263,"first_coordinate":{"x":-1.47496,"y":0.01308},"last_coordinate":{"x":-11.74878,"y":0.95564},"thr_url":"/offline/patterns/92619175cfcd793f.thr","preview_url":"/offline/previews/92619175cfcd793f.webp"},{"path":"stars.thr","name":"stars","category":"root","date_modified":1787850168.0,"coordinates_count":21825,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-76.366,"y":0.99},"thr_url":"/offline/patterns/540755355fcee4ce.thr","preview_url":"/offline/previews/540755355fcee4ce.webp"},{"path":"swirl-overlay.thr","name":"swirl-overlay","category":"root","date_modified":1787850168.0,"coordinates_count":21171,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-158.268,"y":1.0},"thr_url":"/offline/patterns/ac840b2d463b9c6c.thr","preview_url":"/offline/previews/ac840b2d463b9c6c.webp"},{"path":"SwoopyRadiance.thr","name":"SwoopyRadiance","category":"root","date_modified":1787850168.0,"coordinates_count":3949,"first_coordinate":{"x":-565.487,"y":0.1},"last_coordinate":{"x":-635.712,"y":0.0},"thr_url":"/offline/patterns/e7a5ad5b9b95912e.thr","preview_url":"/offline/previews/e7a5ad5b9b95912e.webp"},{"path":"tesselation_twist.thr","name":"tesselation_twist","category":"root","date_modified":1787850169.0,"coordinates_count":2581,"first_coordinate":{"x":2.094,"y":1.0},"last_coordinate":{"x":13.09,"y":0.433},"thr_url":"/offline/patterns/523186b4c40842fa.thr","preview_url":"/offline/previews/523186b4c40842fa.webp"},{"path":"WinterbourneBassett 6-1-1997.thr","name":"WinterbourneBassett 6-1-1997","category":"root","date_modified":1787850168.0,"coordinates_count":23584,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-25.059,"y":0.0},"thr_url":"/offline/patterns/92af445c3d7f9178.thr","preview_url":"/offline/previews/92af445c3d7f9178.webp"},{"path":"WinterbourneStokeDown 7-18-2018.thr","name":"WinterbourneStokeDown 7-18-2018","category":"root","date_modified":1787850168.0,"coordinates_count":5743,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":-94.876,"y":0.001},"thr_url":"/offline/patterns/f2d28651099b3066.thr","preview_url":"/offline/previews/f2d28651099b3066.webp"},{"path":"wormhole.thr","name":"wormhole","category":"root","date_modified":1787850168.0,"coordinates_count":8151,"first_coordinate":{"x":0.0,"y":0.0},"last_coordinate":{"x":161.985,"y":0.997},"thr_url":"/offline/patterns/a92725aa5c657b04.thr","preview_url":"/offline/previews/a92725aa5c657b04.webp"}];
const BY_PATH=Object.fromEntries(CATALOG.map(p=>[p.path,p]));
function directCustomCatalog(){
 try{const raw=window.OrynAndroid&&window.OrynAndroid.directListPatterns?window.OrynAndroid.directListPatterns():'[]';const a=JSON.parse(raw||'[]');return Array.isArray(a)?a:[];}catch(_){return [];}
}
function allPatternCatalog(){return CATALOG.concat(directCustomCatalog());}
function patternEntry(path){return BY_PATH[path]||directCustomCatalog().find(x=>x&&x.path===path)||null;}
function parseThrText(txt){const out=[];for(const line of String(txt||'').split(/\r?\n/)){const q=line.trim();if(!q||q.startsWith('#'))continue;const v=q.split(/[\s,]+/);if(v.length>=2){const a=Number(v[0]),b=Number(v[1]);if(Number.isFinite(a)&&Number.isFinite(b))out.push([a,b]);}}return out;}
function customPreview(path){
 try{const txt=window.OrynAndroid&&window.OrynAndroid.directReadPattern?window.OrynAndroid.directReadPattern(path):'';const pts=parseThrText(txt);if(!pts.length)return {error:'Pattern not found'};let xs=[],ys=[],minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;for(const [t,r] of pts){const x=r*Math.cos(t),y=r*Math.sin(t);xs.push(x);ys.push(y);if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}const w=Math.max(.01,maxX-minX),h=Math.max(.01,maxY-minY);const stride=Math.max(1,Math.ceil(xs.length/4000)),poly=xs.filter((_,i)=>i%stride===0||i===xs.length-1).map((x,j)=>{const i=Math.min(j*stride,xs.length-1);return `${(10+180*(x-minX)/w).toFixed(1)},${(190-180*(ys[i]-minY)/h).toFixed(1)}`}).join(' ');const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="100" fill="#e4bd5d"/><polyline points="${poly}" fill="none" stroke="#5a4823" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/></svg>`;return {image_data:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg),first_coordinate:{x:pts[0][0],y:pts[0][1]},last_coordinate:{x:pts[pts.length-1][0],y:pts[pts.length-1][1]}};
 }catch(e){return {error:String(e)}}
}
const NativeWS=window.WebSocket;
const nativeFetch=window.fetch.bind(window);
const jsonResponse=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const errResponse=(detail,status=503)=>jsonResponse({detail},status);
function readDirectSavedRaw(){
 try{const x=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');return x&&typeof x==='object'?x:{};}catch(_){return {};}
}
function directDisplayName(){try{return String(localStorage.getItem('oryn_direct_name')||'ORYN Direct — ESP32 FluidNC').trim()||'ORYN Direct — ESP32 FluidNC';}catch(_){return 'ORYN Direct — ESP32 FluidNC';}}
function makeOfflineTable(isCurrent){return {id:OFFLINE_ID,name:'ORYN Offline',url:location.origin,host:'app.oryn',isOnline:true,isCurrent:!!isCurrent,version:BUILD};}
function makeDirectTable(cfg,isCurrent){return {id:DIRECT_ID,name:directDisplayName(),url:location.origin,host:String(cfg.host||'192.168.0.1'),directHost:String(cfg.host||'192.168.0.1'),directFluidNC:true,thetaRevUnits:Number(cfg.thetaRev||0),rhoTravelUnits:Number(cfg.rhoTravel||0),rhoDirection:Number(cfg.rhoDirection||1)<0?-1:1,directFeed:Number(cfg.feed||60)||60,isOnline:true,isCurrent:!!isCurrent,version:BUILD};}
function validSavedDirect(cfg){return !!(cfg&&Number(cfg.thetaRev)>0&&Number(cfg.rhoTravel)>0&&String(cfg.host||'').trim());}
function ensureOfflineTable(forceActive){
 try{
  const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}');
  const old=Array.isArray(raw.tables)?raw.tables:[];
  // Connection-state rebuild: DIRECT is never persisted as a fake remote/Pi table.
  // Keep only genuine remote ORYN/Pi entries here; Direct calibration/IP lives in oryn_direct_last.
  const remotes=old.filter(t=>t&&t.id!==OFFLINE_ID&&t.id!==DIRECT_ID&&t.url&&new URL(t.url,location.origin).origin!==location.origin).map(t=>({...t,isCurrent:false}));
  let active=localStorage.getItem('orynmotion_active_table')||raw.activeTableId||OFFLINE_ID;
  const saved=readDirectSavedRaw();
  if(forceActive){active=OFFLINE_ID;localStorage.setItem('oryn_direct_enabled','0');}
  let directActive=!forceActive&&active===DIRECT_ID&&localStorage.getItem('oryn_direct_enabled')==='1'&&validSavedDirect(saved);
  if(active===DIRECT_ID&&!directActive)active=OFFLINE_ID;
  if(active!==DIRECT_ID)localStorage.setItem('oryn_direct_enabled','0');
  if(active!==OFFLINE_ID&&active!==DIRECT_ID&&!remotes.some(t=>t.id===active))active=OFFLINE_ID;
  const tables=directActive?[makeDirectTable(saved,true),makeOfflineTable(false),...remotes]:[makeOfflineTable(true),...remotes];
  localStorage.setItem('orynmotion_tables',JSON.stringify({tables,activeTableId:active}));
  localStorage.setItem('orynmotion_active_table',active);
 }catch(_){
  try{localStorage.setItem('oryn_direct_enabled','0');localStorage.setItem('orynmotion_active_table',OFFLINE_ID);localStorage.setItem('orynmotion_tables',JSON.stringify({tables:[makeOfflineTable(true)],activeTableId:OFFLINE_ID}));}catch(__){}
 }
}
let ORYN_COLD_START=false;
try{ORYN_COLD_START=!!(window.OrynAndroid&&window.OrynAndroid.consumeFreshLaunch&&window.OrynAndroid.consumeFreshLaunch());}catch(_){}
// Unified connection: a real app cold start always opens ORYN in Offline mode.
// Saved ESP32 calibration/IP and discovered Pi tables are retained, but no
// machine is auto-selected merely because it was active before the app closed.
// This prevents a dead Wi-Fi/remote table from sending the React shell to the
// backend reconnect screen when the phone is offline or at a different place.
if(ORYN_COLD_START){
 try{localStorage.setItem('oryn_direct_enabled','0');}catch(_){}
 ensureOfflineTable(true);
}else{
 ensureOfflineTable(false);
}
const methodOf=i=>String((i&&i.method)||'GET').toUpperCase();
function parseBody(init){try{return init&&init.body?JSON.parse(init.body):{};}catch(_){return {};}}
function activeRemote(){try{const raw=localStorage.getItem('orynmotion_tables'),id=localStorage.getItem('orynmotion_active_table');if(!raw||!id)return null;const d=JSON.parse(raw);const t=(d.tables||[]).find(x=>x.id===id);return t&&t.id!==OFFLINE_ID&&!t.isCurrent&&t.url?t:null;}catch(_){return null;}}
function orynBrandString(v){if(typeof v!=='string')return v;return v.replace(/UC[-_ ]DUNE[-_ ]MOTION/gi,'UC-ORYN-MOTION').replace(/DUNE\s*MOTION/gi,'ORYN').replace(/^DUNE$/i,'ORYN');}
function orynBrandObject(v){if(Array.isArray(v))return v.map(orynBrandObject);if(v&&typeof v==='object'){const out={};for(const [k,x] of Object.entries(v))out[k]=orynBrandObject(x);return out;}return orynBrandString(v);}
async function sanitizedRemoteFetch(input,init,u){const r=await nativeFetch(input,init);const ct=(r.headers.get('content-type')||'').toLowerCase();if(!ct.includes('json'))return r;const fallback=r.clone();try{const text=await r.text();let data=text?JSON.parse(text):{};data=orynBrandObject(data);if(u.pathname==='/api/settings'&&data&&data.app){if(/dune/i.test(String(data.app.name||'')))data.app.name='ORYN';}if(u.pathname==='/api/table-info'&&data&&/dune/i.test(String(data.name||'')))data.name='ORYN';const headers=new Headers(r.headers);headers.delete('content-length');return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers});}catch(_){return fallback;}}
function sanitizeStoredOrynBranding(){try{const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}');if(!Array.isArray(raw.tables))return;let changed=false;raw.tables=raw.tables.map(t=>{if(!t)return t;const n=orynBrandString(t.name);if(n!==t.name)changed=true;return {...t,name:n};});if(changed)localStorage.setItem('orynmotion_tables',JSON.stringify(raw));}catch(_){}}

const defaultSettings={
 app:{name:'ORYN',custom_logo:null},connection:{preferred_port:null},
 patterns:{clear_pattern_speed:60,custom_clear_from_in:null,custom_clear_from_out:null},
 auto_play:{enabled:false,playlist:'',run_mode:'loop',pause_time:300,clear_pattern:'adaptive',shuffle:false},
 scheduled_pause:{enabled:false,control_wled:false,finish_pattern:false,timezone:'',time_slots:[]},
 homing:{mode:'crash',user_override:false,angular_offset_degrees:0,home_on_connect:true,auto_home_enabled:true,auto_home_after_patterns:false,hard_reset_theta:false},
 led:{provider:'none',wled_ip:'',control_mode:'manual',dw_led:{num_leds:0,gpio_pin:18,pixel_order:'GRB',brightness:128,speed:128,intensity:128,idle_effect:'Solid',playing_effect:'Solid',idle_timeout_enabled:false,idle_timeout_minutes:0}},
 mqtt:{enabled:false,broker:'',port:1883,username:'',has_password:false,client_id:'oryn-mobile',discovery_prefix:'homeassistant',device_id:'oryn-mobile',device_name:'ORYN Mobile'},
 machine:{detected_table_type:null,table_type_override:null,effective_table_type:null,gear_ratio:null,gear_ratio_override:null,x_steps_per_mm:null,y_steps_per_mm:null,timezone:'',available_table_types:[{value:'kinetiq_motion_mini',label:'KinetiQ Mini / Compatible'},{value:'kinetiq_motion_mini_pro',label:'KinetiQ Mini Pro / Compatible'},{value:'kinetiq_motion_mini_pro_byj',label:'KinetiQ Mini Pro BYJ / Compatible'},{value:'kinetiq_motion_gold',label:'KinetiQ Gold / Compatible'},{value:'kinetiq_motion',label:'KinetiQ Standard / Compatible'},{value:'kinetiq_motion_pro',label:'KinetiQ Pro / Compatible'}]},
 security:{mode:'off',has_password:false}
};
function deepMerge(a,b){if(!b||typeof b!=='object'||Array.isArray(b))return b===undefined?a:b;const o={...(a||{})};for(const [k,v] of Object.entries(b))o[k]=(v&&typeof v==='object'&&!Array.isArray(v))?deepMerge(o[k],v):v;return o;}
function getLocalSettings(){try{return deepMerge(defaultSettings,JSON.parse(localStorage.getItem('oryn_mobile_settings')||'{}'));}catch(_){return defaultSettings;}}
function saveLocalSettings(patch){const merged=deepMerge(getLocalSettings(),patch||{});localStorage.setItem('oryn_mobile_settings',JSON.stringify(merged));return merged;}
function playlists(){try{return JSON.parse(localStorage.getItem('oryn_mobile_playlists')||'{}');}catch(_){return {};}}
function savePlaylists(p){localStorage.setItem('oryn_mobile_playlists',JSON.stringify(p));}
function localKnownTables(){try{const d=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}'),active=localStorage.getItem('orynmotion_active_table');const out=(d.tables||[]).filter(t=>t&&t.id!==OFFLINE_ID&&t.id!==DIRECT_ID&&!t.isCurrent&&t.url&&new URL(t.url,location.origin).origin!==location.origin).map(t=>({id:t.id,name:t.name,url:t.url,host:t.host,port:t.port,version:t.version}));if(active===DIRECT_ID&&directConfig())out.unshift({id:OFFLINE_ID,name:'ORYN Offline',url:location.origin,host:'app.oryn',version:BUILD});return out;}catch(_){return [];}}
async function parseThr(path){const p=patternEntry(path);if(!p)return [];let txt='';if(p.native_path){try{txt=window.OrynAndroid.directReadPattern(path)||'';}catch(_){txt='';}}else{const r=await nativeFetch(p.thr_url);if(!r.ok)return [];txt=await r.text();}return parseThrText(txt);}

function directTable(){try{const d=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}'),id=localStorage.getItem('orynmotion_active_table');return (d.tables||[]).find(t=>t.id===id&&t.directFluidNC)||null;}catch(_){return null;}}
function directConfig(){
 const t=directTable();
 if(t)return {host:t.directHost||'192.168.0.1',thetaRev:Number(t.thetaRevUnits||0),rhoTravel:Number(t.rhoTravelUnits||0),rhoDirection:Number(t.rhoDirection||1),feed:Number(t.directFeed||60)};
 try{
  // A saved Direct controller is not the active transport while ORYN Offline
  // or a Pi table is selected. Keep the saved calibration for one-tap reconnect.
  if(localStorage.getItem('orynmotion_active_table')!==DIRECT_ID)return null;
  if(localStorage.getItem('oryn_direct_enabled')!=='1')return null;
  const x=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');
  const thetaRev=Number(x.thetaRev||0),rhoTravel=Number(x.rhoTravel||0);
  if(!(thetaRev>0)||!(rhoTravel>0))return null;
  return {host:String(x.host||'192.168.0.1'),thetaRev,rhoTravel,rhoDirection:Number(x.rhoDirection||1)<0?-1:1,feed:Number(x.feed||60)||60};
 }catch(_){return null;}
}
function directBridgeJson(method,...args){try{if(!window.OrynAndroid||typeof window.OrynAndroid[method]!=='function')return null;const v=window.OrynAndroid[method](...args);return typeof v==='string'?JSON.parse(v):v;}catch(e){return {success:false,detail:String(e)}}}
function readSavedDirectCalibration(){try{const x=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');return {thetaRev:Number(x.thetaRev||0),rhoTravel:Number(x.rhoTravel||0),rhoDirection:Number(x.rhoDirection||1)<0?-1:1,feed:Number(x.feed||60)||60};}catch(_){return {thetaRev:0,rhoTravel:0,rhoDirection:1,feed:60};}}
function hasSavedDirectCalibration(c){return !!(c&&c.thetaRev>0&&c.rhoTravel>0);}
const DIRECT_ROT_CAL_KEY='oryn_direct_rotation_cal_v1';
const DIRECT_RHO_CAL_KEY='oryn_direct_perimeter_cal_v1';
const DIRECT_SOURCE_CAL_KEY='oryn_direct_source_calibration_v1';
function readDirectCalState(key){try{const x=JSON.parse(sessionStorage.getItem(key)||'{}');return {active:!!x.active,current:Number(x.current||0)};}catch(_){return {active:false,current:0};}}
function writeDirectCalState(key,state){try{sessionStorage.setItem(key,JSON.stringify({active:!!state.active,current:Number(state.current||0)}));}catch(_){}}
function directCalibrationActive(){return readDirectCalState(DIRECT_ROT_CAL_KEY).active||readDirectCalState(DIRECT_RHO_CAL_KEY).active;}
function directStatusNow(){return directBridgeJson('directStatus')||{};}
function directMotionBusyMessage(){const s=directStatusNow();if(s.is_running)return 'A pattern is running. Stop it before calibration.';if(s.is_homing)return 'Homing is running. Wait for Home to finish before calibration.';return '';}
function ensureDirectSourceCalibration(cfg){
 try{const old=JSON.parse(localStorage.getItem(DIRECT_SOURCE_CAL_KEY)||'null');if(old&&Number(old.thetaRev)>0&&Number(old.rhoTravel)>0)return old;}catch(_){}
 const src={thetaRev:Number(cfg.thetaRev),rhoTravel:Number(cfg.rhoTravel),rhoDirection:Number(cfg.rhoDirection)<0?-1:1,feed:Number(cfg.feed)||60};
 try{localStorage.setItem(DIRECT_SOURCE_CAL_KEY,JSON.stringify(src));}catch(_){} return src;
}
function updateDirectCalibration(patch){
 const cfg=directConfig()||readSavedDirectCalibration();
 const next={host:String((patch&&patch.host)||cfg.host||'192.168.0.1'),thetaRev:Number((patch&&patch.thetaRev)!=null?patch.thetaRev:cfg.thetaRev),rhoTravel:Number((patch&&patch.rhoTravel)!=null?patch.rhoTravel:cfg.rhoTravel),rhoDirection:Number((patch&&patch.rhoDirection)!=null?patch.rhoDirection:cfg.rhoDirection)<0?-1:1,feed:Number((patch&&patch.feed)!=null?patch.feed:cfg.feed)||60};
 if(!(next.thetaRev>0)||!(next.rhoTravel>0))throw new Error('Direct calibration requires positive Theta and Rho controller-unit values.');
 localStorage.setItem('oryn_direct_last',JSON.stringify(next));
 try{
  const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}');
  const tables=Array.isArray(raw.tables)?raw.tables:[];
  const t=tables.find(x=>x&&x.id===DIRECT_ID);
  if(t){t.directHost=next.host;t.thetaRevUnits=next.thetaRev;t.rhoTravelUnits=next.rhoTravel;t.rhoDirection=next.rhoDirection;t.directFeed=next.feed;t.isOnline=true;}
  localStorage.setItem('orynmotion_tables',JSON.stringify({...raw,tables,activeTableId:localStorage.getItem('orynmotion_active_table')||raw.activeTableId||DIRECT_ID}));
 }catch(_){}
 return next;
}
function directJog(axis,units,speed){
 const cfg=directConfig();if(!cfg)return {success:false,detail:'ORYN Direct table is not active.'};
 const n=Number(units),f=Math.max(1,Number(speed)||60);if(!Number.isFinite(n)||Math.abs(n)<0.000001)return {success:false,detail:'Invalid calibration jog amount.'};
 return directBridgeJson('directAction',cfg.host,`G91\nG1 ${axis}${n.toFixed(5)} F${f.toFixed(3)}\nG90`)||{success:false,detail:'No response from Android Direct bridge.'};
}
function activateDirectTable(host,cfg){
 const stableHost=String(host||'').trim();const thetaRev=Number(cfg&&cfg.thetaRev),rhoTravel=Number(cfg&&cfg.rhoTravel),rhoDirection=Number(cfg&&cfg.rhoDirection)<0?-1:1,feed=Number(cfg&&cfg.feed)||60;
 if(!stableHost){smartWifiStatus('ESP32 IP address is missing.',true);return false;}
 if(!(thetaRev>0)||!(rhoTravel>0)){smartWifiStatus('Enter valid Theta and Rho calibration values.',true);return false;}
 const saved={host:stableHost,thetaRev,rhoTravel,rhoDirection,feed};
 try{
  localStorage.setItem('oryn_direct_last',JSON.stringify(saved));
  localStorage.setItem('oryn_direct_enabled','1');
  sessionStorage.setItem(DIRECT_AUTO_HOME_PENDING,stableHost);
  localStorage.setItem('orynmotion_active_table',DIRECT_ID);
  const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}'),tables=Array.isArray(raw.tables)?raw.tables:[];
  const remotes=tables.filter(x=>x&&x.id!==OFFLINE_ID&&x.id!==DIRECT_ID&&x.url&&new URL(x.url,location.origin).origin!==location.origin).map(x=>({...x,isCurrent:false}));
  const merged=[makeDirectTable(saved,true),makeOfflineTable(false),...remotes];
  localStorage.setItem('orynmotion_tables',JSON.stringify({tables:merged,activeTableId:DIRECT_ID}));
  smartWifiStatus('Connected ✓  ORYN Direct — ESP32 FluidNC is active.');
  // One deliberate reload lets the locked React table provider rebuild from the
  // new current machine. There is no background/repeating reload path.
  setTimeout(()=>location.reload(),250);return true;
 }catch(e){smartWifiStatus('Could not activate ORYN Direct table: '+e,true);return false;}
}
function showDirectCalibrationSetup(host){
 const old=readSavedDirectCalibration(),box=document.getElementById('oryn-direct-calibration');if(!box)return false;
 box.style.display='block';box.innerHTML=`<div style="font-weight:800;color:#fff;margin-bottom:4px">FluidNC Connected ✓</div><div style="font-size:12px;color:#aaa;margin-bottom:10px">One-time ORYN motion calibration. These are controller units already measured for your table; this does not move the motors.</div><label class="oryn-cal-label">Theta full revolution units</label><input id="oryn-cal-theta" inputmode="decimal" placeholder="Enter saved 360° Theta value" value="${old.thetaRev>0?old.thetaRev:''}" class="oryn-cal-input"><label class="oryn-cal-label">Rho center → perimeter units</label><input id="oryn-cal-rho" inputmode="decimal" placeholder="Enter saved Rho travel value" value="${old.rhoTravel>0?old.rhoTravel:''}" class="oryn-cal-input"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><div><label class="oryn-cal-label">Rho direction</label><select id="oryn-cal-dir" class="oryn-cal-input"><option value="1" ${old.rhoDirection>=0?'selected':''}>+1</option><option value="-1" ${old.rhoDirection<0?'selected':''}>-1</option></select></div><div><label class="oryn-cal-label">Feed</label><input id="oryn-cal-feed" inputmode="decimal" value="${old.feed||60}" class="oryn-cal-input"></div></div><button id="oryn-cal-save" class="oryn-sw-btn" style="width:100%;margin-top:10px;background:#f1c75b;color:#17120a">Save & Activate Table</button>`;
 const save=document.getElementById('oryn-cal-save');save.onclick=()=>{const thetaRev=Number(document.getElementById('oryn-cal-theta').value),rhoTravel=Number(document.getElementById('oryn-cal-rho').value),rhoDirection=Number(document.getElementById('oryn-cal-dir').value),feed=Number(document.getElementById('oryn-cal-feed').value)||60;if(!(thetaRev>0)){smartWifiStatus('Enter your saved Theta 360° controller-unit value.',true);return;}if(!(rhoTravel>0)){smartWifiStatus('Enter your saved Rho center-to-perimeter controller-unit value.',true);return;}activateDirectTable(host,{thetaRev,rhoTravel,rhoDirection,feed});};
 try{box.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(_){} return true;
}
function setWifiRowState(ssid,state){document.querySelectorAll('[data-oryn-wifi-ssid]').forEach(b=>{if(b.dataset.orynWifiSsid!==String(ssid||''))return;if(state==='requesting'){b.textContent='Connecting…';b.disabled=true;}else if(state==='connected'){b.textContent='Connected ✓';b.disabled=true;b.style.background='#d7c16a';}else{b.textContent='Connect';b.disabled=false;}});}
let __orynDirectProbePending=false;
function handleDirectProbeResult(payload,requestedHost){
 __orynDirectProbePending=false;const p=payload||{};
 if(!p.ok){smartWifiStatus('FluidNC did not answer at '+String(requestedHost||p.host||'this address')+'. Check the ESP32 power/network and try again.',true);return false;}
 const stableHost=String(p.host||requestedHost||'').trim();
 if(!stableHost){smartWifiStatus('FluidNC answered but no usable IP address was returned.',true);return false;}
 const old=readSavedDirectCalibration();
 if(hasSavedDirectCalibration(old)){smartWifiStatus('FluidNC detected at '+stableHost+' ✓  Activating ORYN Direct…');return activateDirectTable(stableHost,{...old,host:stableHost});}
 smartWifiStatus('FluidNC detected at '+stableHost+' ✓  Complete the one-time ORYN calibration below.');showDirectCalibrationSetup(stableHost);return true;
}
function probeAndActivateDirect(host){
 const h=String(host||'').trim();if(!h)return false;if(__orynDirectProbePending){smartWifiStatus('Already checking the ESP32…');return false;}
 __orynDirectProbePending=true;smartWifiStatus('Checking FluidNC at '+h+'…');
 try{
  if(window.OrynAndroid&&typeof window.OrynAndroid.directProbeAsync==='function'){window.OrynAndroid.directProbeAsync(h);return true;}
  return handleDirectProbeResult(directBridgeJson('directProbe',h),h);
 }catch(e){__orynDirectProbePending=false;smartWifiStatus('ESP32 connection check failed: '+String(e),true);return false;}
}
window.__orynNativeDirectProbe=function(payload){handleDirectProbeResult(payload,payload&&payload.requested_host);};
function smartWifiModal(){return document.getElementById('oryn-smartwifi-modal');}
function smartWifiStatus(text,error=false){const e=document.getElementById('oryn-smartwifi-status');if(!e)return;e.textContent=text||'';e.style.color=error?'#ff9b9b':'#d9e7db';}
function closeSmartWifi(){const e=smartWifiModal();if(e)e.remove();}
function directWifiState(){return directBridgeJson('directWifiState')||{};}
function renderWifiNetworks(payload){
 const box=document.getElementById('oryn-smartwifi-results');if(!box)return;const nets=(payload&&payload.networks)||[];
 const compatible=nets.filter(n=>n&&n.fluidnc);box.innerHTML='';
 if(!compatible.length){box.innerHTML='<div style="padding:12px;color:#bbb">No FluidNC / ORYN ESP32 Wi‑Fi found. Make sure the ESP32 is in AP mode, then scan again.</div>';return;}
 for(const n of compatible){
  const row=document.createElement('div');row.style.cssText='display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:11px;border:1px solid #333;border-radius:12px;background:#151515';
  const info=document.createElement('div');info.innerHTML='<div style="font-weight:700;color:#fff">'+escapeHtml(n.ssid)+'</div><div style="font-size:12px;color:#999">Signal '+Number(n.rssi||0)+' dBm · '+(n.secure?'Secured':'Open')+'</div>';
  const b=document.createElement('button');b.textContent='Connect';b.dataset.orynWifiSsid=n.ssid;b.style.cssText='border:0;border-radius:10px;padding:9px 13px;font-weight:700;background:#f1c75b;color:#17120a';
  b.onclick=()=>{let pass='';if(n.secure){pass=prompt('Wi‑Fi password for '+n.ssid,n.fluidnc?'12345678':'')||'';if(!pass)return;}setWifiRowState(n.ssid,'requesting');smartWifiStatus('Connecting to '+n.ssid+'… Approve the Android Wi‑Fi request if shown.');try{window.OrynAndroid.connectDirectWifi(n.ssid,pass);}catch(e){setWifiRowState(n.ssid,'error');smartWifiStatus(String(e),true);}};
  row.append(info,b);box.appendChild(row);
 }
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function openSmartWifi(){
 closeSmartWifi();const st=directWifiState();
 const wrap=document.createElement('div');wrap.id='oryn-smartwifi-modal';wrap.style.cssText='position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif';
 const card=document.createElement('div');card.style.cssText='width:min(680px,100%);max-height:90vh;overflow:auto;background:#0f0f0f;border:1px solid #333;border-radius:20px;padding:18px;box-shadow:0 24px 80px #000;color:#eee';
 card.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div><div style="font-size:20px;font-weight:800">ORYN Direct ESP32</div><div style="font-size:12px;color:#aaa;margin-top:3px">Smart Wi‑Fi · no manual Android Wi‑Fi switching</div></div><button id="oryn-sw-close" style="border:0;background:#282828;color:#fff;border-radius:9px;padding:8px 11px">✕</button></div>
 <div id="oryn-sw-cap" style="margin:14px 0;padding:11px;border-radius:12px;background:#171717;font-size:12px;line-height:1.55;color:#bbb"></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><button id="oryn-sw-scan" class="oryn-sw-btn">Scan Wi‑Fi</button><button id="oryn-sw-lan" class="oryn-sw-btn">Find ESP32 on Current Network</button></div>
 <div id="oryn-smartwifi-status" style="min-height:20px;margin:12px 0;font-size:13px;color:#d9e7db">Choose Scan Wi‑Fi. FluidNC will appear when the ESP32 AP is nearby.</div>
 <div id="oryn-smartwifi-results" style="display:grid;gap:8px"></div>
 <div id="oryn-direct-calibration" style="display:none;margin-top:14px;padding:13px;border:1px solid #3a3a3a;border-radius:14px;background:#151515"></div>
 <details style="margin-top:16px;border-top:1px solid #292929;padding-top:12px"><summary style="cursor:pointer;font-weight:700">Wi‑Fi network setup (change anytime)</summary><div style="font-size:12px;color:#aaa;margin:8px 0">At a new place, if the saved network is unavailable the FluidNC AP returns as fallback. Connect to FluidNC, enter the new router or phone-hotspot SSID/password here, save it, then after reboot use Find ESP32 on Current Network.</div><input id="oryn-home-ssid" placeholder="Wi‑Fi network name (SSID)" style="width:100%;box-sizing:border-box;margin:5px 0;padding:10px;border-radius:9px;border:1px solid #333;background:#181818;color:#fff"><input id="oryn-home-pass" type="password" placeholder="Wi‑Fi network password" style="width:100%;box-sizing:border-box;margin:5px 0;padding:10px;border-radius:9px;border:1px solid #333;background:#181818;color:#fff"><button id="oryn-home-save" class="oryn-sw-btn" style="width:100%;margin-top:6px">Save Wi‑Fi Network to ESP32</button></details>
 <details style="margin-top:10px"><summary style="cursor:pointer;font-weight:700">Manual IP fallback</summary><div style="display:flex;gap:8px;margin-top:8px"><input id="oryn-manual-host" value="192.168.0.1" style="flex:1;padding:10px;border-radius:9px;border:1px solid #333;background:#181818;color:#fff"><button id="oryn-manual-go" class="oryn-sw-btn">Connect</button></div></details>`;
 const style=document.createElement('style');style.textContent='.oryn-sw-btn{border:1px solid #3b3b3b;border-radius:10px;padding:10px 12px;background:#202020;color:#fff;font-weight:700}.oryn-sw-btn:active{transform:translateY(1px)}.oryn-cal-label{display:block;font-size:11px;color:#aaa;margin:8px 0 4px}.oryn-cal-input{width:100%;box-sizing:border-box;padding:10px;border-radius:9px;border:1px solid #333;background:#181818;color:#fff}';card.appendChild(style);wrap.appendChild(card);document.body.appendChild(wrap);
 document.getElementById('oryn-sw-close').onclick=closeSmartWifi;wrap.addEventListener('click',e=>{if(e.target===wrap)closeSmartWifi();});
 const cap=document.getElementById('oryn-sw-cap');cap.innerHTML=(st.internet_available?'✓ Internet currently available':'Internet status will be checked after connection')+'<br>'+(st.sta_concurrency_supported?'✓ This phone reports simultaneous primary Wi‑Fi + local-only Wi‑Fi support.':'• If this phone cannot keep two Wi‑Fi links at once, cellular Internet can remain default; for Wi‑Fi Internet use the Wi‑Fi network setup below.');
 document.getElementById('oryn-sw-scan').onclick=()=>{smartWifiStatus('Scanning nearby Wi‑Fi…');document.getElementById('oryn-smartwifi-results').innerHTML='';try{window.OrynAndroid.scanWifiNetworks();}catch(e){smartWifiStatus(String(e),true);}};
 document.getElementById('oryn-sw-lan').onclick=()=>{const last=readDirectSavedRaw();smartWifiStatus('Searching current Wi‑Fi / phone-hotspot network for FluidNC…');try{window.OrynAndroid.discoverFluidNcLan(String(last.host||''));}catch(e){smartWifiStatus(String(e),true);}};
 document.getElementById('oryn-home-save').onclick=()=>{const ssid=document.getElementById('oryn-home-ssid').value.trim(),pass=document.getElementById('oryn-home-pass').value;if(!ssid){smartWifiStatus('Enter the Wi‑Fi network name.',true);return;}const ws=directWifiState(),cfg=directConfig(),saved=readDirectSavedRaw();const host=(ws&&ws.connected)?'192.168.0.1':String((cfg&&cfg.host)||saved.host||'192.168.0.1');smartWifiStatus('Writing Wi‑Fi network settings to FluidNC at '+host+'…');const r=directBridgeJson('configureFluidNcHomeWifi',host,ssid,pass);if(r&&r.success)smartWifiStatus(r.message||'Saved. Power-cycle ESP32, connect this phone to that Wi‑Fi, then use Find ESP32 on Current Network. You can change this network again later without reflashing.');else smartWifiStatus((r&&r.detail)||'Could not save Wi‑Fi network.',true);};
 try{const last=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');if(last.host)document.getElementById('oryn-manual-host').value=last.host;}catch(_){}
 document.getElementById('oryn-manual-go').onclick=()=>{const h=document.getElementById('oryn-manual-host').value.trim();if(h)probeAndActivateDirect(h);};
}
window.__orynNativeWifiScan=function(payload){if(!smartWifiModal())openSmartWifi();if(payload&&payload.ok){renderWifiNetworks(payload);smartWifiStatus((payload.networks||[]).some(n=>n.fluidnc)?'FluidNC found. Tap Connect.':'Scan finished — FluidNC was not found.',!(payload.networks||[]).some(n=>n.fluidnc));}else smartWifiStatus((payload&&payload.error)||'Wi‑Fi scan failed.',true);};
window.__orynNativeWifiConnection=function(state){if(!smartWifiModal())openSmartWifi();const bad=state&&['error','unavailable','lost','unsupported'].includes(state.status);if(state&&state.ssid)setWifiRowState(state.ssid,state.status);const msg=(state&&state.message)||'Wi‑Fi status changed.';smartWifiStatus(msg,bad);if(state&&state.status==='connected'){smartWifiStatus((state.internet_available?'Internet available. ':'')+'FluidNC Wi‑Fi connected ✓  Detecting controller…');setTimeout(()=>probeAndActivateDirect('192.168.0.1'),650);}};
window.__orynNativeFluidDiscovery=function(payload){if(!smartWifiModal())openSmartWifi();if(payload&&payload.ok&&payload.device&&payload.device.host){smartWifiStatus('FluidNC found at '+payload.device.host+' ✓');setTimeout(()=>probeAndActivateDirect(payload.device.host),100);}else smartWifiStatus((payload&&payload.error)||'No FluidNC controller found on this Wi‑Fi / hotspot network.',true);};
function addDirectTable(){openSmartWifi();}

function rehydrateDirectTransport(){
 const cfg=directConfig();if(!cfg||!window.OrynAndroid)return;
 setTimeout(()=>{try{
  const st=directBridgeJson('directStatus')||{};
  // Unified connection: Home/pattern playback owns the FluidNC Telnet session. Never
  // open a background $I probe while motion is active.
  if(st.is_running||st.is_homing)return;
  const q=st.connected?{ok:true,host:cfg.host}:directBridgeJson('directProbe',cfg.host);
  if(q&&q.ok&&q.host&&q.host!==cfg.host){try{const x=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');x.host=q.host;localStorage.setItem('oryn_direct_last',JSON.stringify(x));}catch(_){}}
  if(q&&q.ok)runPendingDirectAutoHome({...cfg,host:String(q.host||cfg.host)});
 }catch(_){}},700);
}
function runPendingDirectAutoHome(cfg){
 try{
  const pending=sessionStorage.getItem(DIRECT_AUTO_HOME_PENDING);
  const homing=(getLocalSettings().homing||{});
  if(!pending||pending!==String(cfg.host||'')||homing.home_on_connect===false||homing.auto_home_enabled===false)return false;
  const st=directStatusNow();if(st.is_running||st.is_homing)return false;
  const started=!!(window.OrynAndroid&&window.OrynAndroid.directHome&&window.OrynAndroid.directHome(cfg.host,cfg.rhoTravel,cfg.rhoDirection,cfg.feed));
  if(started){sessionStorage.removeItem(DIRECT_AUTO_HOME_PENDING);mobileToast('Connected — automatic Home started.');}
  return started;
 }catch(_){return false;}
}
rehydrateDirectTransport();

// Diagnostic: surface the exact native motion failure once.
// This reads in-memory status and never opens a controller/network socket.
let __orynDirectErrorSeen='';
setInterval(()=>{try{
 if(!directConfig()||!window.OrynAndroid)return;
 const st=directBridgeJson('directStatus')||{},err=String(st.error||'').trim();
 if(err&&err!==__orynDirectErrorSeen&&!st.is_running&&!st.is_homing){__orynDirectErrorSeen=err;mobileToast(err);}
 if(!err)__orynDirectErrorSeen='';
}catch(_){}},900);

async function directFetch(u,init={}){
 const cfg=directConfig();if(!cfg)return errResponse('ORYN Direct table is not configured.',503);
 const p=u.pathname,m=String(init.method||'GET').toUpperCase(),b=parseBody(init);
 if(p==='/api/table-info'&&m==='GET')return jsonResponse({id:DIRECT_ID,name:directDisplayName(),version:BUILD});
 if(p==='/api/table-info'&&m==='PATCH'){const name=String(b.name||'').trim();if(name){localStorage.setItem('oryn_direct_name',name);try{const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}');raw.tables=(raw.tables||[]).map(t=>t&&t.id===DIRECT_ID?{...t,name}:t);localStorage.setItem('orynmotion_tables',JSON.stringify(raw));}catch(_){}return jsonResponse({success:true,id:DIRECT_ID,name});}return errResponse('Table name is required.',400);}
 if(p==='/api/settings'&&m==='GET'){const st=getLocalSettings();return jsonResponse({...st,app:{...(st.app||{}),name:directDisplayName()}});}
 if(p==='/api/settings'&&m==='PATCH')return jsonResponse(saveLocalSettings(b));
 if(p==='/list_theta_rho_files')return jsonResponse(allPatternCatalog().map(x=>x.path));
 if(p==='/list_theta_rho_files_with_metadata')return jsonResponse(allPatternCatalog().map(({path,name,category,date_modified,coordinates_count})=>({path,name,category,date_modified,coordinates_count})));
 if(p==='/preview_thr_batch'&&m==='POST'){const out={};for(const name of (b.file_names||[])){const x=patternEntry(name);out[name]=x?(x.native_path?customPreview(name):{image_data:x.preview_url,first_coordinate:x.first_coordinate,last_coordinate:x.last_coordinate}):{error:'Pattern not found'};}return jsonResponse(out);}
 if(p==='/get_theta_rho_coordinates'&&m==='POST'){const coordinates=await parseThr(b.file_name);return jsonResponse({success:true,coordinates,total_points:coordinates.length});}
 if(p==='/api/pattern_history_all')return jsonResponse({});if(p.startsWith('/api/pattern_history/'))return jsonResponse({actual_time_formatted:null,speed:null});
 if(p==='/list_all_playlists')return jsonResponse(Object.keys(playlists()));
 if(p==='/get_playlist'){const n=u.searchParams.get('name')||'';const ps=playlists();return jsonResponse({name:n,files:ps[n]||[]});}
 if(['/create_playlist','/modify_playlist'].includes(p)&&m==='POST'){const ps=playlists();ps[b.playlist_name]=Array.isArray(b.files)?b.files:[];savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/add_to_playlist'&&m==='POST'){const ps=playlists(),arr=ps[b.playlist_name]||[];if(b.pattern&&!arr.includes(b.pattern))arr.push(b.pattern);ps[b.playlist_name]=arr;savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/serial_status')return jsonResponse({connected:true,port:'Wi‑Fi → '+cfg.host,firmware:'FluidNC'});if(p==='/list_serial_ports')return jsonResponse(['Wi‑Fi → '+cfg.host]);
 if(p==='/connect'){const q=directBridgeJson('directProbe',cfg.host);if(q&&q.ok){localStorage.setItem('oryn_direct_enabled','1');try{const x=JSON.parse(localStorage.getItem('oryn_direct_last')||'{}');if(q.host)x.host=q.host;localStorage.setItem('oryn_direct_last',JSON.stringify(x));sessionStorage.setItem(DIRECT_AUTO_HOME_PENDING,String(q.host||cfg.host));}catch(_){}runPendingDirectAutoHome({...cfg,host:String(q.host||cfg.host)});return jsonResponse({success:true,message:'Direct FluidNC connected'});}return errResponse((q&&q.error)||'FluidNC did not respond.',503);}if(p==='/disconnect')return jsonResponse({success:true});
 if(p==='/api/rotation-calibration'&&m==='GET'){
  ensureDirectSourceCalibration(cfg);const st=readDirectCalState(DIRECT_ROT_CAL_KEY);
  return jsonResponse({calibrated:cfg.thetaRev>0,theta_calibrated:cfg.thetaRev>0,theta_revolution_units:cfg.thetaRev,effective_units:cfg.thetaRev,active:st.active,current_units:st.current,revision:BUILD,direct:true});
 }
 if(p==='/api/rotation-calibration/start'&&m==='POST'){
  const busy=directMotionBusyMessage();if(busy)return errResponse(busy,409);ensureDirectSourceCalibration(cfg);
  const z=directBridgeJson('directAction',cfg.host,'G92 X0');if(!z||!z.success)return errResponse((z&&z.detail)||'Could not establish Theta calibration zero.',503);
  writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:true,current:0});writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:false,current:0});
  return jsonResponse({success:true,active:true,current_units:0,direct:true});
 }
 if(p==='/api/rotation-calibration/jog'&&m==='POST'){
  const st=readDirectCalState(DIRECT_ROT_CAL_KEY);if(!st.active)return errResponse('Start Full-Circle Calibration first.',409);
  const units=Number(b.units),speed=Number(b.speed)||80;const r=directJog('X',units,speed);if(!r||!r.success)return errResponse((r&&r.detail)||'Theta calibration jog failed.',503);
  const current=st.current+units;writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:true,current});return jsonResponse({success:true,active:true,current_units:current,response:r.response||'',direct:true});
 }
 if(p==='/api/rotation-calibration/save'&&m==='POST'){
  const st=readDirectCalState(DIRECT_ROT_CAL_KEY);const units=Math.abs(Number(st.current||0));if(!st.active||!(units>0.1))return errResponse('Jog Theta through exactly one physical revolution before saving.',409);
  const next=updateDirectCalibration({thetaRev:units});const z=directBridgeJson('directAction',next.host,'G92 X0');if(!z||!z.success)return errResponse((z&&z.detail)||'Calibration value saved, but Theta zero could not be restored.',503);
  writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,calibrated:true,theta_revolution_units:next.thetaRev,direct:true});
 }
 if(p==='/api/rotation-calibration/set'&&m==='POST'){
  const units=Math.abs(Number(b.units));if(!(units>0))return errResponse('Enter valid positive controller units for one complete revolution.',400);
  ensureDirectSourceCalibration(cfg);const next=updateDirectCalibration({thetaRev:units});writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,calibrated:true,theta_revolution_units:next.thetaRev,direct:true});
 }
 if(p==='/api/rotation-calibration/reset'&&m==='POST'){
  const src=ensureDirectSourceCalibration(cfg);const next=updateDirectCalibration({thetaRev:Number(src.thetaRev)});writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,restored:true,calibrated:true,theta_revolution_units:next.thetaRev,direct:true});
 }
 if(p==='/api/perimeter-calibration'&&m==='GET'){
  ensureDirectSourceCalibration(cfg);const st=readDirectCalState(DIRECT_RHO_CAL_KEY);
  return jsonResponse({calibrated:cfg.rhoTravel>0,rho_calibrated:cfg.rhoTravel>0,rho_travel_units:cfg.rhoTravel,rho_direction:cfg.rhoDirection,effective_units:cfg.rhoTravel,active:st.active,current_units:st.current,revision:BUILD,direct:true});
 }
 if(p==='/api/perimeter-calibration/start'&&m==='POST'){
  const busy=directMotionBusyMessage();if(busy)return errResponse(busy,409);ensureDirectSourceCalibration(cfg);
  const z=directBridgeJson('directAction',cfg.host,'G92 Y0');if(!z||!z.success)return errResponse((z&&z.detail)||'Could not establish current Center as Rho zero.',503);
  writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:true,current:0});writeDirectCalState(DIRECT_ROT_CAL_KEY,{active:false,current:0});
  return jsonResponse({success:true,active:true,current_units:0,direct:true});
 }
 if(p==='/api/perimeter-calibration/jog'&&m==='POST'){
  const st=readDirectCalState(DIRECT_RHO_CAL_KEY);if(!st.active)return errResponse('Start Perimeter Calibration from the physical center first.',409);
  const units=Number(b.units),speed=Number(b.speed)||60;const machineUnits=units*cfg.rhoDirection;const r=directJog('Y',machineUnits,speed);if(!r||!r.success)return errResponse((r&&r.detail)||'Rho calibration jog failed.',503);
  const current=st.current+units;writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:true,current});return jsonResponse({success:true,active:true,current_units:current,response:r.response||'',direct:true});
 }
 if(p==='/api/perimeter-calibration/save'&&m==='POST'){
  const st=readDirectCalState(DIRECT_RHO_CAL_KEY);const units=Math.abs(Number(st.current||0));if(!st.active||!(units>0.001))return errResponse('Jog Rho from Center to the exact physical perimeter before saving.',409);
  const next=updateDirectCalibration({rhoTravel:units});writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,calibrated:true,rho_travel_units:next.rhoTravel,rho_direction:next.rhoDirection,direct:true});
 }
 if(p==='/api/perimeter-calibration/set'&&m==='POST'){
  const units=Math.abs(Number(b.units));if(!(units>0))return errResponse('Enter a valid positive Center-to-Perimeter controller-unit travel.',400);
  ensureDirectSourceCalibration(cfg);const next=updateDirectCalibration({rhoTravel:units});writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,calibrated:true,rho_travel_units:next.rhoTravel,rho_direction:next.rhoDirection,direct:true});
 }
 if(p==='/api/perimeter-calibration/reset'&&m==='POST'){
  const src=ensureDirectSourceCalibration(cfg);const next=updateDirectCalibration({rhoTravel:Number(src.rhoTravel),rhoDirection:Number(src.rhoDirection)});writeDirectCalState(DIRECT_RHO_CAL_KEY,{active:false,current:0});return jsonResponse({success:true,restored:true,calibrated:true,rho_travel_units:next.rhoTravel,rho_direction:next.rhoDirection,direct:true});
 }
 if(p==='/api/machine-hardware-profile')return jsonResponse({build:BUILD,read_only:true,controller_source:'direct-fluidnc',profile:{initialized:true},geometry:{theta_calibrated:true,theta_revolution_units:cfg.thetaRev,rho_calibrated:true,rho_travel_units:cfg.rhoTravel,rho_direction:cfg.rhoDirection}});
 if(p==='/api/pattern-designer/save'&&m==='POST'){if(!b||!b.thr)return errResponse('Missing generated THR.',400);let r=directBridgeJson('directSavePattern',String(b.name||'Pattern'),String(b.thr||''));if(!r||!r.success)return errResponse((r&&r.detail)||'Could not save pattern to Android library.',400);return jsonResponse(r);}
 if(p==='/delete_theta_rho_file'&&m==='POST'){const name=String(b.file_name||b.filename||b.path||'');const x=patternEntry(name);if(!x||!x.native_path)return errResponse('Only locally generated Direct ESP32 patterns can be deleted here.',400);const ok=!!(window.OrynAndroid&&window.OrynAndroid.directDeletePattern&&window.OrynAndroid.directDeletePattern(name));return ok?jsonResponse({success:true}):errResponse('Could not delete local pattern.',500);}
 if(p==='/run_theta_rho'&&m==='POST'){
  if(directCalibrationActive())return errResponse('Finish or save the active machine calibration before starting a pattern.',409);
  const x=patternEntry(b.file_name);if(!x)return errResponse('Pattern is not available in the local ORYN library.',404);
  const seq=[];if(b.pre_execution&&b.pre_execution!=='none'){
    let clearName=null;const st=directBridgeJson('directStatus')||{};
    if(b.pre_execution==='from_center'||b.pre_execution==='clear_from_in')clearName='clear_from_in.thr'; else if(b.pre_execution==='from_perimeter'||b.pre_execution==='clear_from_out')clearName='clear_from_out.thr';
    else if(b.pre_execution==='adaptive')clearName=(Number(st.rho||0)>=0.5?'clear_from_out.thr':'clear_from_in.thr');
    const c=clearName&&patternEntry(clearName);if(c)seq.push({asset:c.native_path||c.thr_url.replace(/^\//,''),display:c.path||clearName});
  }
  seq.push({asset:x.native_path||x.thr_url.replace(/^\//,''),display:x.path||String(b.file_name||'pattern.thr')});
  const started=window.OrynAndroid&&window.OrynAndroid.directStartPattern&&window.OrynAndroid.directStartPattern(cfg.host,JSON.stringify(seq),cfg.thetaRev,cfg.rhoTravel,cfg.rhoDirection,cfg.feed);
  return started?jsonResponse({success:true,direct:true}):errResponse('Another direct pattern is already running.',409);
 }
 if(p==='/send_home'){
   if(directCalibrationActive())return errResponse('Finish or save the active machine calibration before Home.',409);
   const started=!!(window.OrynAndroid&&window.OrynAndroid.directHome&&window.OrynAndroid.directHome(cfg.host,cfg.rhoTravel,cfg.rhoDirection,cfg.feed));
   if(started)return jsonResponse({success:true,direct:true,homing:true,host:cfg.host});
   const st=directBridgeJson('directStatus')||{};
   return errResponse(st.error||'Direct Home could not start because another motion is active.',409);
 }
 if(p==='/move_to_center'){if(directCalibrationActive())return errResponse('Finish or save the active machine calibration first.',409);const st=directStatusNow(),r=directBridgeJson('directMoveLogical',cfg.host,Number(st.theta||0),0,cfg.thetaRev,cfg.rhoTravel,cfg.rhoDirection,cfg.feed);return r&&r.success?jsonResponse({success:true,direct:true}):errResponse((r&&r.detail)||'Could not move to Center.',503);}
 if(p==='/move_to_perimeter'){if(directCalibrationActive())return errResponse('Finish or save the active machine calibration first.',409);const st=directStatusNow(),r=directBridgeJson('directMoveLogical',cfg.host,Number(st.theta||0),1,cfg.thetaRev,cfg.rhoTravel,cfg.rhoDirection,cfg.feed);return r&&r.success?jsonResponse({success:true,direct:true}):errResponse((r&&r.detail)||'Could not move to Perimeter.',503);}
 if(p==='/send_coordinate'){const r=directBridgeJson('directMoveLogical',cfg.host,Number(b.theta||0),Number(b.rho||0),cfg.thetaRev,cfg.rhoTravel,cfg.rhoDirection,cfg.feed);return r&&r.success?jsonResponse({success:true,direct:true}):errResponse((r&&r.detail)||'Could not move to coordinate.',503);}
 if(p==='/set_speed'){const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}');const t=(raw.tables||[]).find(x=>x.id===DIRECT_ID);if(t){t.directFeed=Number(b.speed)||cfg.feed;localStorage.setItem('orynmotion_tables',JSON.stringify(raw));}return jsonResponse({success:true});}
 if(p==='/stop_execution'||p==='/force_stop'){try{window.OrynAndroid.directStopNow();}catch(_){}return jsonResponse({success:true});}
 if(p==='/pause_execution'){try{window.OrynAndroid.directPauseNow();}catch(_){}return jsonResponse({success:true});}
 if(p==='/resume_execution'){try{window.OrynAndroid.directResumeNow();}catch(_){}return jsonResponse({success:true});}
 if(p==='/soft_reset'){try{window.OrynAndroid.directStopNow();}catch(_){}return jsonResponse({success:true});}
 if(p==='/get_led_config')return jsonResponse({provider:'none',wled_ip:'',dw_led_num_leds:0,dw_led_brightness:128,dw_led_speed:128,dw_led_intensity:128});
 if(p==='/api/version')return jsonResponse({current:BUILD,latest:BUILD,update_available:false});
 return errResponse('This ORYN function is not yet mapped in Direct ESP32 prototype.',501);
}

function useDirectEndpoint(path){
 if(!directConfig())return false;
 if(path.startsWith('/api/rotation-calibration')||path.startsWith('/api/perimeter-calibration'))return true;
 return ['/api/table-info','/serial_status','/list_serial_ports','/connect','/disconnect','/run_theta_rho','/send_home','/send_coordinate','/move_to_center','/move_to_perimeter','/set_speed','/stop_execution','/force_stop','/pause_execution','/resume_execution','/soft_reset','/api/machine-hardware-profile','/api/pattern-designer/save','/delete_theta_rho_file'].includes(path);
}

window.fetch=async function(input,init={}){
 const raw=typeof input==='string'?input:(input&&input.url)||String(input);
 const u=new URL(raw,location.href);
 if(u.hostname==='direct.oryn')return directFetch(u,init);
 if(u.origin!==location.origin)return sanitizedRemoteFetch(input,init,u);
 const p=u.pathname,m=String(init.method||(typeof input!=='string'&&input.method)||'GET').toUpperCase();
 if(p.startsWith('/assets/')||p.startsWith('/static/')||p.startsWith('/offline/'))return nativeFetch(input,init);
 if(useDirectEndpoint(p))return directFetch(new URL('http://direct.oryn'+u.pathname+u.search),init);
 if(p==='/api/table-info'&&m==='GET')return jsonResponse({id:OFFLINE_ID,name:'ORYN Offline',version:BUILD});
 if(p==='/api/table-info'&&m==='PATCH')return jsonResponse({success:true,id:OFFLINE_ID,name:'ORYN Offline'});
 if(p==='/api/settings'&&m==='GET'){const st=getLocalSettings();const appName=directConfig()?'ORYN Direct — ESP32 FluidNC':'ORYN Offline';return jsonResponse({...st,app:{...(st.app||{}),name:appName}});}
 if(p==='/api/settings'&&m==='PATCH')return jsonResponse(saveLocalSettings(parseBody(init)));
 if(p==='/api/known-tables'&&m==='GET')return jsonResponse({tables:localKnownTables()});
 if(p.startsWith('/api/known-tables'))return jsonResponse({success:true});
 if(p==='/api/manifest.webmanifest')return nativeFetch('/offline/manifest.webmanifest');
 if(p==='/list_theta_rho_files')return jsonResponse(allPatternCatalog().map(x=>x.path));
 if(p==='/list_theta_rho_files_with_metadata')return jsonResponse(allPatternCatalog().map(({path,name,category,date_modified,coordinates_count})=>({path,name,category,date_modified,coordinates_count})));
 if(p==='/preview_thr_batch'&&m==='POST'){
   const names=parseBody(init).file_names||[],out={};
   for(const name of names){const x=patternEntry(name);out[name]=x?(x.native_path?customPreview(name):{image_data:x.preview_url,first_coordinate:x.first_coordinate,last_coordinate:x.last_coordinate}):{error:'Pattern not found'};}
   return jsonResponse(out);
 }
 if(p==='/get_theta_rho_coordinates'&&m==='POST'){
   const name=parseBody(init).file_name;const coordinates=await parseThr(name);return jsonResponse({success:true,coordinates,total_points:coordinates.length});
 }
 if(p==='/api/pattern_history_all')return jsonResponse({});
 if(p.startsWith('/api/pattern_history/'))return jsonResponse({actual_time_formatted:null,speed:null});
 if(p==='/list_all_playlists')return jsonResponse(Object.keys(playlists()));
 if(p==='/get_playlist') {const n=u.searchParams.get('name')||'';const ps=playlists();return jsonResponse({name:n,files:ps[n]||[]});}
 if(['/create_playlist','/modify_playlist'].includes(p)&&m==='POST'){const b=parseBody(init),ps=playlists();ps[b.playlist_name]=Array.isArray(b.files)?b.files:[];savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/add_to_playlist'&&m==='POST'){const b=parseBody(init),ps=playlists(),arr=ps[b.playlist_name]||[];if(b.pattern&&!arr.includes(b.pattern))arr.push(b.pattern);ps[b.playlist_name]=arr;savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/delete_playlist'){const b=parseBody(init),ps=playlists();delete ps[b.playlist_name];savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/rename_playlist'&&m==='POST'){const b=parseBody(init),ps=playlists();ps[b.new_name]=ps[b.old_name]||[];delete ps[b.old_name];savePlaylists(ps);return jsonResponse({success:true});}
 if(p==='/list_serial_ports')return jsonResponse([]);
 if(p==='/serial_status')return jsonResponse({connected:false,port:null});
 if(p==='/get_led_config')return jsonResponse({provider:'none',wled_ip:'',dw_led_num_leds:0,dw_led_brightness:128,dw_led_speed:128,dw_led_intensity:128});
 if(p==='/api/version')return jsonResponse({current:'10.4.1 Mobile',latest:'10.4.1 Mobile',update_available:false});
 if(p==='/api/machine-hardware-profile')return jsonResponse({build:'V7-Mobile',read_only:true,controller_source:'offline',supported_drivers:{A4988:[1,2,4,8,16],DRV8825:[1,2,4,8,16,32],TMC2208:[1,2,4,8,16,32,64,128,256],TMC2209:[1,2,4,8,16,32,64,128,256],TMC5160:[1,2,4,8,16,32,64,128,256],CUSTOM_STEP_DIR:[1,2,4,8,16,32,64,128,256]},profile:{initialized:false,x:{driver:'A4988',microsteps:16},y:{driver:'A4988',microsteps:16}},controller:{axes:{x:{},y:{}}},geometry:{theta_calibrated:false,theta_revolution_units:null,rho_calibrated:false,rho_travel_units:null}});
 if(p==='/api/wifi/status')return jsonResponse({connected:false,ssid:null,ip_address:null,platform:'android'});
 if(p==='/api/wifi/networks'||p==='/api/wifi/saved')return jsonResponse({networks:[],saved:[]});
 if(p.startsWith('/api/dw_leds/'))return jsonResponse({success:true,power:false,brightness:0,effects:[],palettes:[],colors:[]});
 if(p==='/api/logs')return jsonResponse({logs:[]});
 if(p==='/api/security/verify')return jsonResponse({valid:false});
 // Machine-changing actions require a real table; fail clearly rather than pretend.
 if(['/run_theta_rho','/send_home','/send_coordinate','/move_to_center','/move_to_perimeter','/set_speed','/connect','/disconnect','/stop_execution','/force_stop','/pause_execution','/resume_execution','/skip_pattern','/upload_theta_rho','/delete_theta_rho_file'].includes(p)||p.startsWith('/api/perimeter-calibration')||p.startsWith('/api/rotation-calibration')||p.startsWith('/api/fluidnc')||p.startsWith('/api/v2/pattern-generator')||p==='/api/machine-hardware-profile/apply')return errResponse('Connect to an ORYN table to use this machine function. The Android library remains available offline.',409);
 return errResponse('This function requires a connected ORYN table.',503);
};
function localSocket(url){try{const u=new URL(String(url));return u.hostname==='app.oryn';}catch(_){return false;}}
function directSocket(url){try{return new URL(String(url)).hostname==='direct.oryn';}catch(_){return false;}}
class MockSocket extends EventTarget{
 constructor(url){super();this.url=String(url);this.readyState=0;this.bufferedAmount=0;this.extensions='';this.protocol='';this.binaryType='blob';setTimeout(()=>{if(this.readyState!==0)return;this.readyState=1;const e=new Event('open');this.dispatchEvent(e);if(this.onopen)this.onopen(e);if(this.url.includes('/ws/status')){this._timer=setInterval(()=>this._tick(),300);this._tick();}},20);}
 _tick(){if(this.readyState!==1)return;const cfg=directConfig();let data;if(cfg){let s={};try{s=JSON.parse(window.OrynAndroid.directStatus()||'{}')}catch(_){};data={type:'status_update',data:{current_file:s.current_file||null,is_paused:!!s.is_paused,manual_pause:!!s.is_paused,scheduled_pause:false,is_running:!!s.is_running,is_homing:!!s.is_homing,is_clearing:false,sensor_homing_failed:false,progress:s.total?{current:s.current||0,total:s.total,percentage:s.percentage||0,elapsed_time:Number(s.elapsed_time||0),remaining_time:Number(s.remaining_time||0),last_completed_time:Number(s.last_completed_time||0)>0?{actual_time_seconds:Number(s.last_completed_time)}:null}:null,playlist:null,speed:s.speed||cfg.feed,pause_time_remaining:0,original_pause_time:null,connection_status:!!s.connected,current_theta:s.theta||0,current_rho:s.rho||0,firmware_version:s.connected?'FluidNC Direct':null,table_type:'ORYN Direct',rho_calibrated:true,rho_travel_units:cfg.rhoTravel,theta_calibrated:true,theta_revolution_units:cfg.thetaRev,rotation_calibration_active:readDirectCalState(DIRECT_ROT_CAL_KEY).active,perimeter_calibration_active:readDirectCalState(DIRECT_RHO_CAL_KEY).active}};}else{data={type:'status_update',data:{current_file:null,is_paused:false,manual_pause:false,scheduled_pause:false,is_running:false,is_homing:false,is_clearing:false,sensor_homing_failed:false,progress:null,playlist:null,speed:60,pause_time_remaining:0,original_pause_time:null,connection_status:false,current_theta:0,current_rho:0,firmware_version:null,table_type:null,rho_calibrated:false,rho_travel_units:null,theta_calibrated:false,theta_revolution_units:null,rotation_calibration_active:false,perimeter_calibration_active:false}};}const me=new MessageEvent('message',{data:JSON.stringify(data)});this.dispatchEvent(me);if(this.onmessage)this.onmessage(me);}
 send(){} close(){if(this._timer)clearInterval(this._timer);if(this.readyState>=2)return;this.readyState=3;const e=new CloseEvent('close',{code:1000,reason:'ORYN local socket'});this.dispatchEvent(e);if(this.onclose)this.onclose(e);} }
class DirectStatusSocket extends EventTarget{
 constructor(url){super();this.url=String(url);this.readyState=0;setTimeout(()=>{this.readyState=1;const e=new Event('open');this.dispatchEvent(e);if(this.onopen)this.onopen(e);this._timer=setInterval(()=>this._tick(),300);this._tick();},20);}
 _tick(){if(this.readyState!==1)return;let s={};try{s=JSON.parse(window.OrynAndroid.directStatus()||'{}')}catch(_){};const data={type:'status_update',data:{current_file:s.current_file||null,is_paused:!!s.is_paused,manual_pause:!!s.is_paused,scheduled_pause:false,is_running:!!s.is_running,is_homing:!!s.is_homing,is_clearing:false,sensor_homing_failed:false,progress:s.total?{current:s.current||0,total:s.total,percentage:s.percentage||0,elapsed_time:Number(s.elapsed_time||0),remaining_time:Number(s.remaining_time||0),last_completed_time:Number(s.last_completed_time||0)>0?{actual_time_seconds:Number(s.last_completed_time)}:null}:null,playlist:null,speed:s.speed||60,pause_time_remaining:0,original_pause_time:null,connection_status:!!s.connected,current_theta:s.theta||0,current_rho:s.rho||0,firmware_version:'FluidNC Direct',table_type:'ORYN Direct',rho_calibrated:true,rho_travel_units:directConfig()?.rhoTravel||null,theta_calibrated:true,theta_revolution_units:directConfig()?.thetaRev||null,rotation_calibration_active:readDirectCalState(DIRECT_ROT_CAL_KEY).active,perimeter_calibration_active:readDirectCalState(DIRECT_RHO_CAL_KEY).active}};const e=new MessageEvent('message',{data:JSON.stringify(data)});this.dispatchEvent(e);if(this.onmessage)this.onmessage(e);}
 send(){} close(){if(this._timer)clearInterval(this._timer);this.readyState=3;const e=new CloseEvent('close',{code:1000,reason:'ORYN Direct socket'});this.dispatchEvent(e);if(this.onclose)this.onclose(e);}}
function OrynWebSocket(url,protocols){if(localSocket(url))return new MockSocket(url);if(directSocket(url))return new DirectStatusSocket(url);return protocols===undefined?new NativeWS(url):new NativeWS(url,protocols);} OrynWebSocket.CONNECTING=0;OrynWebSocket.OPEN=1;OrynWebSocket.CLOSING=2;OrynWebSocket.CLOSED=3;window.WebSocket=OrynWebSocket;
function mergeDiscovered(tables){
 try{
  const raw=JSON.parse(localStorage.getItem('orynmotion_tables')||'{}'),old=Array.isArray(raw.tables)?raw.tables:[];
  const active=localStorage.getItem('orynmotion_active_table')||OFFLINE_ID;
  const directActive=active===DIRECT_ID&&localStorage.getItem('oryn_direct_enabled')==='1'&&validSavedDirect(readDirectSavedRaw());
  const remoteMap=new Map();
  for(const t of old){if(t&&t.id!==OFFLINE_ID&&t.id!==DIRECT_ID&&t.url&&new URL(t.url,location.origin).origin!==location.origin)remoteMap.set(t.id,{...t,isCurrent:false});}
  for(const t of tables||[]){if(t&&t.id&&t.id!==OFFLINE_ID&&t.id!==DIRECT_ID&&t.url)remoteMap.set(t.id,{...t,name:orynBrandString(t.name||'ORYN'),isOnline:true,isCurrent:false});}
  const remotes=[...remoteMap.values()];
  const merged=directActive?[makeDirectTable(readDirectSavedRaw(),true),makeOfflineTable(false),...remotes]:[makeOfflineTable(true),...remotes];
  const validActive=active===OFFLINE_ID||(directActive&&active===DIRECT_ID)||remotes.some(t=>t.id===active);
  const finalActive=validActive?active:OFFLINE_ID;
  localStorage.setItem('orynmotion_tables',JSON.stringify({tables:merged,activeTableId:finalActive}));
  localStorage.setItem('orynmotion_active_table',finalActive);
 }catch(e){console.error('ORYN native discovery merge failed',e);}
}
window.__orynNativeDiscovery=function(tables){mergeDiscovered(Array.isArray(tables)?tables:[]);const b=document.getElementById('oryn-native-scan-btn');if(b)b.textContent=(tables&&tables.length)?'ORYN found':'Scan for ORYN';if(!tables||!tables.length)mobileToast('No ORYN Pi found on this network. Use Add ORYN Pi Manually, or ESP32 Smart Connect for FluidNC.');};
function mobileToast(text){let e=document.getElementById('oryn-mobile-toast');if(!e){e=document.createElement('div');e.id='oryn-mobile-toast';Object.assign(e.style,{position:'fixed',left:'16px',right:'16px',bottom:'82px',zIndex:'99999',padding:'12px 14px',borderRadius:'12px',background:'rgba(20,20,20,.96)',color:'#fff',font:'500 13px system-ui',boxShadow:'0 10px 30px rgba(0,0,0,.35)',textAlign:'center'});document.body.appendChild(e);}e.textContent=text;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(()=>e.style.display='none',3500);}
function installNativeButtons(){
 if(!window.OrynAndroid)return;
 const buttons=[...document.querySelectorAll('button')];const add=buttons.find(b=>(b.textContent||'').trim().includes('Add Table Manually'));
 if(!add||document.getElementById('oryn-native-scan-btn'))return;try{add.textContent='Add ORYN Pi Manually';}catch(_){}
 const scan=add.cloneNode(true);scan.id='oryn-native-scan-btn';scan.textContent='Scan for ORYN';scan.addEventListener('click',e=>{e.stopPropagation();scan.textContent='Scanning…';try{window.OrynAndroid.startDiscovery();}catch(_){scan.textContent='Scan for ORYN';}});add.parentNode.insertBefore(scan,add);
 const wifi=add.cloneNode(true);wifi.id='oryn-native-wifi-btn';wifi.textContent='Open Wi‑Fi Settings';wifi.addEventListener('click',e=>{e.stopPropagation();try{window.OrynAndroid.openWifiSettings();}catch(_){}});add.parentNode.insertBefore(wifi,add);
 const direct=add.cloneNode(true);direct.id='oryn-native-direct-btn';direct.textContent='ESP32 Smart Connect';direct.addEventListener('click',e=>{e.stopPropagation();addDirectTable();});add.parentNode.insertBefore(direct,add);
 }
new MutationObserver(installNativeButtons).observe(document.documentElement,{childList:true,subtree:true});

// Machine identity is now driven only by the authoritative table provider.
ensureOfflineTable(false);

function scrubVisibleLegacyBrand(){try{const root=document.body;if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const next=orynBrandString(n.nodeValue);if(next!==n.nodeValue)n.nodeValue=next;}}catch(_){}}
new MutationObserver(()=>scrubVisibleLegacyBrand()).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
sanitizeStoredOrynBranding();setTimeout(scrubVisibleLegacyBrand,250);
setTimeout(()=>{try{
 // While Direct ESP32 is configured, do not launch the unrelated
 // ORYN/Pi HTTP discovery sweep automatically. It can still be started by the
 // user's explicit Scan for ORYN button.
 if(window.OrynAndroid&&localStorage.getItem('oryn_direct_enabled')!=='1')window.OrynAndroid.startDiscovery();
}catch(_){}},900);
})();
