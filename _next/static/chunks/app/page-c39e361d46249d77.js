(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [931], {
        6601: function() {},
        5286: function(e, s, a) {
            Promise.resolve().then(a.bind(a, 9507))
        },
        9507: function(e, s, a) {
            "use strict";
            a.r(s), a.d(s, {
                default: function() {
                    return h
                }
            });
            var i = a(7437),
                l = a(4583),
                t = a(3073),
                n = a(7355),
                c = a(2265);
            let r = (0, a(4232).default)(() => Promise.all([a.e(562), a.e(981)]).then(a.bind(a, 981)), {
                loadableGenerated: {
                    webpack: () => [981]
                },
                ssr: !1
            });

            function d() {
                let [e, s] = (0, c.useState)([]), [a, l] = (0, c.useState)([]), [t, n] = (0, c.useState)([]), [d, o] = (0, c.useState)(!0), {
                    width: h
                } = function() {
                    let [e, s] = (0, c.useState)({
                        width: void 0,
                        height: void 0
                    });
                    return (0, c.useEffect)(() => {
                        function e() {
                            s({
                                width: window.innerWidth,
                                height: window.innerHeight
                            })
                        }
                        return window.addEventListener("resize", e), e(), () => window.removeEventListener("resize", e)
                    }, []), e
                }();
                async function m() {
                    let e = await fetch("/api/get-stats").then(async e => await e.json());
                    console.log(e, "resp"), s(s => 0 == s.length ? e.slice(0, 15).map(e => e._sum.amount) : s), l(s => 0 == s.length ? e.slice(0, 15).map(e => e.from) : s), n(s => 0 == s.length ? e : s), o(!1)
                }
                return (0, c.useEffect)(() => {
                    (null == e ? void 0 : e.length) == 0 && m()
                }, []), console.log(e), (0, i.jsx)("div", {
                    className: "pb-10",
                    children: !d && (null == e ? void 0 : e.length) > 0 && (null == a ? void 0 : a.length) > 0 ? (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsxs)("div", {
                            className: "pt-14",
                            children: [(0, i.jsx)("div", {
                                className: "h1 pb-6",
                                children: "TOP 15 CONTRIBUTORS"
                            }), (0, i.jsx)("div", {
                                className: "chart-holder",
                                children: (0, i.jsx)("div", {
                                    children: h && (0, i.jsx)(r, {
                                        id: "chart",
                                        options: {
                                            grid: {
                                                padding: {
                                                    left: -(h / 5),
                                                    right: -(h / 5)
                                                }
                                            },
                                            chart: {
                                                id: "Date"
                                            },
                                            title: {
                                                style: {
                                                    color: "var(--brand-primary1-base)"
                                                }
                                            },
                                            labels: a,
                                            dataLabels: {
                                                enabled: !0,
                                                style: {
                                                    fontSize: h < 800 ? "6.5px" : h < 1400 ? "10px" : "15px"
                                                },
                                                formatter: (s, a) => e ? "".concat(e[a.seriesIndex], " SOL") : ""
                                            },
                                            legend: {
                                                show: h > 1e3,
                                                position: "right",
                                                labels: {
                                                    colors: "var(--base-darkshade-base)"
                                                }
                                            },
                                            tooltip: {
                                                theme: "dark"
                                            }
                                        },
                                        series: e,
                                        type: "donut",
                                        height: "auto",
                                        width: "100%"
                                    })
                                })
                            })]
                        }), (0, i.jsxs)("div", {
                            className: "pt-14",
                            children: [(0, i.jsx)("div", {
                                className: "h1 pb-6",
                                children: "TOP 100 CONTRIBUTORS"
                            }), (0, i.jsx)("div", {
                                className: "chart-holder-table",
                                children: (0, i.jsxs)("div", {
                                    className: "holder-table",
                                    children: [(0, i.jsxs)("div", {
                                        className: "holder-table-row holder-table-header",
                                        children: [(0, i.jsx)("div", {
                                            children: "Rank"
                                        }), (0, i.jsx)("div", {
                                            children: "Wallet"
                                        }), (0, i.jsx)("div", {
                                            children: "Total"
                                        })]
                                    }), t.map((e, s) => (0, i.jsxs)("div", {
                                        className: "holder-table-row",
                                        children: [(0, i.jsx)("div", {
                                            className: "cell",
                                            children: s + 1
                                        }), (0, i.jsx)("div", {
                                            className: "cell",
                                            children: e.from
                                        }), (0, i.jsxs)("div", {
                                            className: "cell",
                                            children: [e._sum.amount.toLocaleString(), " SOL"]
                                        })]
                                    }, e.from))]
                                })
                            })]
                        })]
                    }) : "Loading..."
                })
            }
            let o = new n.ew("https://blanch-t5201g-fast-mainnet.helius-rpc.com/");

            function h() {
                let [e, s] = (0, c.useState)(0), [a, r] = (0, c.useState)([]), h = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                });
                return (0, c.useEffect)(() => {
                    if (document) {
                        let e = document.createElement("img");
                        e.src = "/images/coin.png", r([e])
                    }(async () => {
                        let e = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").then(e => e.json());
                        s(await o.getBalance(new n.nh("HdENn8wP6srk1AuE2CaJj6bRbjcU2kYs12H4C4HgNAsF")) / n.j5 * e.solana.usd)
                    })()
                }, []), (0, i.jsxs)(i.Fragment, {
                    children: [(0, i.jsx)("div", {
                        className: "wrapper_header",
                        children: (0, i.jsxs)("div", {
                            className: "header",
                            children: [(0, i.jsxs)("div", {
                                className: "menu_left",
                                children: [(0, i.jsx)("a", {
                                    href: "/raids",
                                    children: (0, i.jsx)("div", {
                                        className: "raids-button",
                                        children: "RAIDS "
                                    })
                                }), (0, i.jsx)("a", {
                                    href: "/#about",
                                    className: "menu_button w-button",
                                    children: "About"
                                }), (0, i.jsx)("a", {
                                    href: "/#WHO",
                                    className: "menu_button w-button",
                                    children: "WHO IS SLERF"
                                }), (0, i.jsx)("a", {
                                    href: "/#TOK",
                                    className: "menu_button w-button",
                                    children: "SLERFNOMICS"
                                }), (0, i.jsx)("a", {
                                    href: "/#STATS",
                                    className: "menu_button w-button",
                                    children: "STATS"
                                }), (0, i.jsx)("a", {
                                    href: "/raids",
                                    className: "menu_button w-button",
                                    children: "RAIDS"
                                })]
                            }), (0, i.jsxs)("div", {
                                className: "menu_right",
                                children: [(0, i.jsx)("a", {
                                    href: "https://t.me/slerfthesloth",
                                    target: "_blank",
                                    className: "socials tg w-button"
                                }), (0, i.jsx)("a", {
                                    href: "https://twitter.com/Slerfsol",
                                    target: "_blank",
                                    className: "socials twitter w-button"
                                })]
                            })]
                        })
                    }), (0, i.jsxs)("main", {
                        className: "body",
                        children: [a.length > 0 && (0, i.jsx)(l.Z, {
                            snowflakeCount: 25,
                            images: a,
                            radius: [10, 100]
                        }), (0, i.jsx)("div", {
                            className: "wrapper",
                            children: (0, i.jsxs)("div", {
                                className: "section_hero",
                                children: [(0, i.jsx)("div", {
                                    className: "block_chara",
                                    children: (0, i.jsx)("img", {
                                        src: "images/slerf.png",
                                        loading: "lazy",
                                        alt: "",
                                        className: "booby"
                                    })
                                }), (0, i.jsxs)("div", {
                                    className: "block_logo",
                                    children: [(0, i.jsxs)("div", {
                                        className: "main-text",
                                        children: [(0, i.jsx)("img", {
                                            src: "/images/coin.png",
                                            className: "coin"
                                        }), "SLERF"]
                                    }), (0, i.jsx)("div", {
                                        className: "pre-sale",
                                        children: "PRE SALE SOLD OUT!"
                                    }), (0, i.jsx)("div", {
                                        className: "block_ca",
                                        "data-tooltip-id": "tt",
                                        id: "tt",
                                        onClick: function() {
                                            navigator.clipboard.writeText("7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3")
                                        },
                                        children: (0, i.jsxs)("div", {
                                            className: "ca",
                                            children: ["CONTRACT ADDRESS:", (0, i.jsx)("br", {}), "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3"]
                                        })
                                    }), (0, i.jsx)(t.u, {
                                        id: "tt",
                                        place: "bottom",
                                        content: "Click to Copy"
                                    }), (0, i.jsxs)("div", {
                                        className: "loading-parent",
                                        children: [(0, i.jsxs)("div", {
                                            className: "break-points",
                                            children: [(0, i.jsxs)("div", {
                                                className: "break-1",
                                                children: ["WAGMI", (0, i.jsxs)("div", {
                                                    className: "arrow",
                                                    children: [(0, i.jsx)("span", {}), (0, i.jsx)("span", {}), (0, i.jsx)("span", {})]
                                                })]
                                            }), (0, i.jsxs)("div", {
                                                className: "break-2",
                                                children: ["MOON", (0, i.jsxs)("div", {
                                                    className: "arrow",
                                                    children: [(0, i.jsx)("span", {}), (0, i.jsx)("span", {}), (0, i.jsx)("span", {})]
                                                })]
                                            }), (0, i.jsxs)("div", {
                                                className: "break-3",
                                                children: ["THE NEXT BOME", (0, i.jsxs)("div", {
                                                    className: "arrow",
                                                    children: [(0, i.jsx)("span", {}), (0, i.jsx)("span", {}), (0, i.jsx)("span", {})]
                                                })]
                                            }), (0, i.jsxs)("div", {
                                                className: "break-3",
                                                children: ["UNSTOPPABLE", (0, i.jsxs)("div", {
                                                    className: "arrow",
                                                    children: [(0, i.jsx)("span", {}), (0, i.jsx)("span", {}), (0, i.jsx)("span", {})]
                                                })]
                                            })]
                                        }), (0, i.jsxs)("div", {
                                            className: "loading-bar",
                                            children: [(0, i.jsx)("div", {
                                                className: "half-bar",
                                                style: {
                                                    width: "".concat(100, "%")
                                                }
                                            }), (0, i.jsx)("div", {
                                                className: "progress-overlay"
                                            }), (0, i.jsx)("div", {
                                                className: "break1usd",
                                                children: "$1M"
                                            }), (0, i.jsx)("div", {
                                                className: "break2usd",
                                                children: "$2.5M"
                                            }), (0, i.jsx)("div", {
                                                className: "break3usd",
                                                children: "$5M"
                                            }), (0, i.jsx)("div", {
                                                className: "break4usd",
                                                children: "$10M"
                                            }), (0, i.jsx)("img", {
                                                src: "/images/push.png",
                                                className: "slerf-progress"
                                            }), (0, i.jsxs)("div", {
                                                className: "tool-tip",
                                                children: [(0, i.jsx)("div", {
                                                    className: "tool-tip-1",
                                                    children: h.format(e)
                                                }), (0, i.jsx)("div", {
                                                    className: "tool-tip-2"
                                                }), (0, i.jsx)("div", {
                                                    className: "tool-tip-3"
                                                })]
                                            })]
                                        })]
                                    })]
                                })]
                            })
                        }), (0, i.jsx)("div", {
                            className: "separator_blue",
                            id: "WHO",
                            children: (0, i.jsx)("div", {
                                className: "separator_in",
                                children: (0, i.jsx)("div", {
                                    className: "separator_in2"
                                })
                            })
                        }), (0, i.jsxs)("div", {
                            className: "section_about",
                            children: [(0, i.jsx)("div", {
                                className: "section_block_about_wrapper",
                                children: (0, i.jsxs)("div", {
                                    className: "block_about",
                                    children: [(0, i.jsx)("div", {
                                        className: "h1 blk",
                                        children: "WHO IS SLERF"
                                    }), (0, i.jsx)("div", {
                                        className: "block_paragraph",
                                        children: (0, i.jsx)("p", {
                                            className: "para",
                                            children: "Once upon a time, nestled in the lush canopies of the Amazon rainforest, lived Slerf the sloth, famed for his lethargic yet endearing ways. One fateful night, as he gazed upon the shimmering moon, an idea sparked within him. Determined to reach the celestial body, Slerf embarked on his slow and steady journey, inching his way through the dense foliage. With unwavering determination, he traversed rivers and climbed towering trees, each movement deliberate and calculated. As the days turned into weeks, Slerf's perseverance paid off, as he finally reached the moon, basking in its ethereal glow, becoming the first sloth to achieve such a feat. And from that moment on, Slerf's legendary ascent inspired creatures across blockchains to reach for the stars, proving that even the slowest among us can achieve greatness with patience and determination."
                                        })
                                    })]
                                })
                            }), (0, i.jsx)("img", {
                                src: "images/bath.png",
                                loading: "lazy",
                                alt: "",
                                className: "cloud_right"
                            })]
                        }), (0, i.jsx)("div", {
                            className: "separator_blue",
                            id: "TOK",
                            children: (0, i.jsx)("div", {
                                className: "separator_in",
                                children: (0, i.jsx)("div", {
                                    className: "separator_in2"
                                })
                            })
                        }), (0, i.jsxs)("div", {
                            className: "wrapper_tokenomics",
                            id: "tokenomics",
                            children: [(0, i.jsx)("img", {
                                src: "/images/hanging.png",
                                className: "hanging"
                            }), (0, i.jsxs)("div", {
                                className: "tokenomics",
                                children: [(0, i.jsx)("div", {
                                    className: "h1",
                                    children: "SLERFNOMICS"
                                }), (0, i.jsxs)("div", {
                                    "data-w-id": "4c6bb17c-4a56-13b4-3585-2eb3e7861ee4",
                                    className: "tokenomics_details",
                                    children: [(0, i.jsxs)("div", {
                                        className: "tokenomics_top",
                                        children: [(0, i.jsxs)("div", {
                                            className: "toke_details",
                                            children: [(0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "TOTAL SUPPLY"
                                            }), (0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "TBA"
                                            })]
                                        }), (0, i.jsxs)("div", {
                                            className: "toke_details",
                                            children: [(0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "50% LP"
                                            }), (0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "50% PRESALE"
                                            })]
                                        })]
                                    }), (0, i.jsxs)("div", {
                                        className: "tokenomics_bottom",
                                        children: [(0, i.jsxs)("div", {
                                            className: "toke_details",
                                            children: [(0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "LP BURNED"
                                            }), (0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "AT LAUNCH"
                                            })]
                                        }), (0, i.jsxs)("div", {
                                            className: "toke_details",
                                            children: [(0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "OWNERSHIP"
                                            }), (0, i.jsx)("div", {
                                                className: "tokenomics_title",
                                                children: "REVOKED"
                                            })]
                                        })]
                                    })]
                                })]
                            })]
                        }), (0, i.jsx)("div", {
                            className: "separator_blue",
                            id: "STATS",
                            children: (0, i.jsx)("div", {
                                className: "separator_in",
                                children: (0, i.jsx)("div", {
                                    className: "separator_in2"
                                })
                            })
                        }), (0, i.jsx)(d, {})]
                    })]
                })
            }
        }
    },
    function(e) {
        e.O(0, [814, 175, 971, 69, 744], function() {
            return e(e.s = 5286)
        }), _N_E = e.O()
    }
]);