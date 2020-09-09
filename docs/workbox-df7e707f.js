define('./workbox-df7e707f.js', ['exports'], function (e) {
    'use strict';
    try {
        self['workbox:core:5.1.3'] && _();
    } catch (e) {}
    const t = (e, ...t) => {
        let n = e;
        return t.length > 0 && (n += ' :: ' + JSON.stringify(t)), n;
    };
    class n extends Error {
        constructor(e, n) {
            super(t(e, n)), (this.name = e), (this.details = n);
        }
    }
    const s = {
            googleAnalytics: 'googleAnalytics',
            precache: 'precache-v2',
            prefix: 'workbox',
            runtime: 'runtime',
            suffix: 'undefined' != typeof registration ? registration.scope : ''
        },
        i = (e) =>
            [s.prefix, e, s.suffix].filter((e) => e && e.length > 0).join('-'),
        c = (e) => {
            ((e) => {
                for (const t of Object.keys(s)) e(t);
            })((t) => {
                'string' == typeof e[t] && (s[t] = e[t]);
            });
        },
        o = (e) => e || i(s.precache);
    const r = (e) =>
            new URL(String(e), location.href).href.replace(
                new RegExp('^' + location.origin),
                ''
            ),
        a = new Set();
    const u = (e, t) => e.filter((e) => t in e),
        l = async ({ request: e, mode: t, plugins: n = [] }) => {
            const s = u(n, 'cacheKeyWillBeUsed');
            let i = e;
            for (const e of s)
                (i = await e.cacheKeyWillBeUsed.call(e, {
                    mode: t,
                    request: i
                })),
                    'string' == typeof i && (i = new Request(i));
            return i;
        },
        h = async ({
            cacheName: e,
            request: t,
            event: n,
            matchOptions: s,
            plugins: i = []
        }) => {
            const c = await self.caches.open(e),
                o = await l({ plugins: i, request: t, mode: 'read' });
            let r = await c.match(o, s);
            for (const t of i)
                if ('cachedResponseWillBeUsed' in t) {
                    const i = t.cachedResponseWillBeUsed;
                    r = await i.call(t, {
                        cacheName: e,
                        event: n,
                        matchOptions: s,
                        cachedResponse: r,
                        request: o
                    });
                }
            return r;
        },
        f = async ({
            cacheName: e,
            request: t,
            response: s,
            event: i,
            plugins: c = [],
            matchOptions: o
        }) => {
            const f = await l({ plugins: c, request: t, mode: 'write' });
            if (!s)
                throw new n('cache-put-with-no-response', { url: r(f.url) });
            const w = await (async ({
                request: e,
                response: t,
                event: n,
                plugins: s = []
            }) => {
                let i = t,
                    c = !1;
                for (const t of s)
                    if ('cacheWillUpdate' in t) {
                        c = !0;
                        const s = t.cacheWillUpdate;
                        if (
                            ((i = await s.call(t, {
                                request: e,
                                response: i,
                                event: n
                            })),
                            !i)
                        )
                            break;
                    }
                return c || (i = i && 200 === i.status ? i : void 0), i || null;
            })({ event: i, plugins: c, response: s, request: f });
            if (!w) return;
            const d = await self.caches.open(e),
                p = u(c, 'cacheDidUpdate'),
                y =
                    p.length > 0
                        ? await h({ cacheName: e, matchOptions: o, request: f })
                        : null;
            try {
                await d.put(f, w);
            } catch (e) {
                throw (
                    ('QuotaExceededError' === e.name &&
                        (await (async function () {
                            for (const e of a) await e();
                        })()),
                    e)
                );
            }
            for (const t of p)
                await t.cacheDidUpdate.call(t, {
                    cacheName: e,
                    event: i,
                    oldResponse: y,
                    newResponse: w,
                    request: f
                });
        },
        w = async ({
            request: e,
            fetchOptions: t,
            event: s,
            plugins: i = []
        }) => {
            if (
                ('string' == typeof e && (e = new Request(e)),
                s instanceof FetchEvent && s.preloadResponse)
            ) {
                const e = await s.preloadResponse;
                if (e) return e;
            }
            const c = u(i, 'fetchDidFail'),
                o = c.length > 0 ? e.clone() : null;
            try {
                for (const t of i)
                    if ('requestWillFetch' in t) {
                        const n = t.requestWillFetch,
                            i = e.clone();
                        e = await n.call(t, { request: i, event: s });
                    }
            } catch (e) {
                throw new n('plugin-error-request-will-fetch', {
                    thrownError: e
                });
            }
            const r = e.clone();
            try {
                let n;
                n = 'navigate' === e.mode ? await fetch(e) : await fetch(e, t);
                for (const e of i)
                    'fetchDidSucceed' in e &&
                        (n = await e.fetchDidSucceed.call(e, {
                            event: s,
                            request: r,
                            response: n
                        }));
                return n;
            } catch (e) {
                for (const t of c)
                    await t.fetchDidFail.call(t, {
                        error: e,
                        event: s,
                        originalRequest: o.clone(),
                        request: r.clone()
                    });
                throw e;
            }
        };
    let d;
    async function p(e, t) {
        const n = e.clone(),
            s = {
                headers: new Headers(n.headers),
                status: n.status,
                statusText: n.statusText
            },
            i = t ? t(s) : s,
            c = (function () {
                if (void 0 === d) {
                    const e = new Response('');
                    if ('body' in e)
                        try {
                            new Response(e.body), (d = !0);
                        } catch (e) {
                            d = !1;
                        }
                    d = !1;
                }
                return d;
            })()
                ? n.body
                : await n.blob();
        return new Response(c, i);
    }
    try {
        self['workbox:precaching:5.1.3'] && _();
    } catch (e) {}
    function y(e) {
        if (!e) throw new n('add-to-cache-list-unexpected-type', { entry: e });
        if ('string' == typeof e) {
            const t = new URL(e, location.href);
            return { cacheKey: t.href, url: t.href };
        }
        const { revision: t, url: s } = e;
        if (!s) throw new n('add-to-cache-list-unexpected-type', { entry: e });
        if (!t) {
            const e = new URL(s, location.href);
            return { cacheKey: e.href, url: e.href };
        }
        const i = new URL(s, location.href),
            c = new URL(s, location.href);
        return (
            i.searchParams.set('__WB_REVISION__', t),
            { cacheKey: i.href, url: c.href }
        );
    }
    class g {
        constructor(e) {
            (this.t = o(e)),
                (this.s = new Map()),
                (this.i = new Map()),
                (this.o = new Map());
        }
        addToCacheList(e) {
            const t = [];
            for (const s of e) {
                'string' == typeof s
                    ? t.push(s)
                    : s && void 0 === s.revision && t.push(s.url);
                const { cacheKey: e, url: i } = y(s),
                    c =
                        'string' != typeof s && s.revision
                            ? 'reload'
                            : 'default';
                if (this.s.has(i) && this.s.get(i) !== e)
                    throw new n('add-to-cache-list-conflicting-entries', {
                        firstEntry: this.s.get(i),
                        secondEntry: e
                    });
                if ('string' != typeof s && s.integrity) {
                    if (this.o.has(e) && this.o.get(e) !== s.integrity)
                        throw new n(
                            'add-to-cache-list-conflicting-integrities',
                            { url: i }
                        );
                    this.o.set(e, s.integrity);
                }
                if ((this.s.set(i, e), this.i.set(i, c), t.length > 0)) {
                    const e = `Workbox is precaching URLs without revision info: ${t.join(
                        ', '
                    )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
                    console.warn(e);
                }
            }
        }
        async install({ event: e, plugins: t } = {}) {
            const n = [],
                s = [],
                i = await self.caches.open(this.t),
                c = await i.keys(),
                o = new Set(c.map((e) => e.url));
            for (const [e, t] of this.s)
                o.has(t) ? s.push(e) : n.push({ cacheKey: t, url: e });
            const r = n.map(({ cacheKey: n, url: s }) => {
                const i = this.o.get(n),
                    c = this.i.get(s);
                return this.u({
                    cacheKey: n,
                    cacheMode: c,
                    event: e,
                    integrity: i,
                    plugins: t,
                    url: s
                });
            });
            await Promise.all(r);
            return { updatedURLs: n.map((e) => e.url), notUpdatedURLs: s };
        }
        async activate() {
            const e = await self.caches.open(this.t),
                t = await e.keys(),
                n = new Set(this.s.values()),
                s = [];
            for (const i of t)
                n.has(i.url) || (await e.delete(i), s.push(i.url));
            return { deletedURLs: s };
        }
        async u({
            cacheKey: e,
            url: t,
            cacheMode: s,
            event: i,
            plugins: c,
            integrity: o
        }) {
            const r = new Request(t, {
                integrity: o,
                cache: s,
                credentials: 'same-origin'
            });
            let a,
                u = await w({ event: i, plugins: c, request: r });
            for (const e of c || []) 'cacheWillUpdate' in e && (a = e);
            if (
                !(a
                    ? await a.cacheWillUpdate({
                          event: i,
                          request: r,
                          response: u
                      })
                    : u.status < 400)
            )
                throw new n('bad-precaching-response', {
                    url: t,
                    status: u.status
                });
            u.redirected && (u = await p(u)),
                await f({
                    event: i,
                    plugins: c,
                    response: u,
                    request: e === t ? r : new Request(e),
                    cacheName: this.t,
                    matchOptions: { ignoreSearch: !0 }
                });
        }
        getURLsToCacheKeys() {
            return this.s;
        }
        getCachedURLs() {
            return [...this.s.keys()];
        }
        getCacheKeyForURL(e) {
            const t = new URL(e, location.href);
            return this.s.get(t.href);
        }
        async matchPrecache(e) {
            const t = e instanceof Request ? e.url : e,
                n = this.getCacheKeyForURL(t);
            if (n) {
                return (await self.caches.open(this.t)).match(n);
            }
        }
        createHandler(e = !0) {
            return async ({ request: t }) => {
                try {
                    const e = await this.matchPrecache(t);
                    if (e) return e;
                    throw new n('missing-precache-entry', {
                        cacheName: this.t,
                        url: t instanceof Request ? t.url : t
                    });
                } catch (n) {
                    if (e) return fetch(t);
                    throw n;
                }
            };
        }
        createHandlerBoundToURL(e, t = !0) {
            if (!this.getCacheKeyForURL(e))
                throw new n('non-precached-url', { url: e });
            const s = this.createHandler(t),
                i = new Request(e);
            return () => s({ request: i });
        }
    }
    let R;
    const q = () => (R || (R = new g()), R);
    const U = (e, t) => {
        const n = q().getURLsToCacheKeys();
        for (const s of (function* (
            e,
            {
                ignoreURLParametersMatching: t,
                directoryIndex: n,
                cleanURLs: s,
                urlManipulation: i
            } = {}
        ) {
            const c = new URL(e, location.href);
            (c.hash = ''), yield c.href;
            const o = (function (e, t = []) {
                for (const n of [...e.searchParams.keys()])
                    t.some((e) => e.test(n)) && e.searchParams.delete(n);
                return e;
            })(c, t);
            if ((yield o.href, n && o.pathname.endsWith('/'))) {
                const e = new URL(o.href);
                (e.pathname += n), yield e.href;
            }
            if (s) {
                const e = new URL(o.href);
                (e.pathname += '.html'), yield e.href;
            }
            if (i) {
                const e = i({ url: c });
                for (const t of e) yield t.href;
            }
        })(e, t)) {
            const e = n.get(s);
            if (e) return e;
        }
    };
    let m = !1;
    function v(e) {
        m ||
            ((({
                ignoreURLParametersMatching: e = [/^utm_/],
                directoryIndex: t = 'index.html',
                cleanURLs: n = !0,
                urlManipulation: s
            } = {}) => {
                const i = o();
                self.addEventListener('fetch', (c) => {
                    const o = U(c.request.url, {
                        cleanURLs: n,
                        directoryIndex: t,
                        ignoreURLParametersMatching: e,
                        urlManipulation: s
                    });
                    if (!o) return;
                    let r = self.caches
                        .open(i)
                        .then((e) => e.match(o))
                        .then((e) => e || fetch(o));
                    c.respondWith(r);
                });
            })(e),
            (m = !0));
    }
    const L = [],
        x = {
            get: () => L,
            add(e) {
                L.push(...e);
            }
        },
        K = (e) => {
            const t = q(),
                n = x.get();
            e.waitUntil(
                t.install({ event: e, plugins: n }).catch((e) => {
                    throw e;
                })
            );
        },
        M = (e) => {
            const t = q();
            e.waitUntil(t.activate());
        };
    (e.clientsClaim = function () {
        self.addEventListener('activate', () => self.clients.claim());
    }),
        (e.precacheAndRoute = function (e, t) {
            !(function (e) {
                q().addToCacheList(e),
                    e.length > 0 &&
                        (self.addEventListener('install', K),
                        self.addEventListener('activate', M));
            })(e),
                v(t);
        }),
        (e.setCacheNameDetails = function (e) {
            c(e);
        }),
        (e.skipWaiting = function () {
            self.addEventListener('install', () => self.skipWaiting());
        });
});
