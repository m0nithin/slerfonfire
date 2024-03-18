(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [175], {
        2109: function(t, e, r) {
            "use strict";
            e._O = e.Jq = e.KB = e.u8 = e.cv = void 0, e.Ik = e.A9 = e.n_ = e.gM = void 0;
            let n = r(3663);

            function i(t) {
                if (!(t instanceof Uint8Array)) throw TypeError("b must be a Uint8Array")
            }

            function o(t) {
                return i(t), n.Buffer.from(t.buffer, t.byteOffset, t.length)
            }
            class s {
                constructor(t, e) {
                    if (!Number.isInteger(t)) throw TypeError("span must be an integer");
                    this.span = t, this.property = e
                }
                makeDestinationObject() {
                    return {}
                }
                getSpan(t, e) {
                    if (0 > this.span) throw RangeError("indeterminate span");
                    return this.span
                }
                replicate(t) {
                    let e = Object.create(this.constructor.prototype);
                    return Object.assign(e, this), e.property = t, e
                }
                fromArray(t) {}
            }

            function u(t, e) {
                return e.property ? t + "[" + e.property + "]" : t
            }
            class a extends s {
                isCount() {
                    throw Error("ExternalLayout is abstract")
                }
            }
            class l extends a {
                constructor(t, e = 0, r) {
                    if (!(t instanceof s)) throw TypeError("layout must be a Layout");
                    if (!Number.isInteger(e)) throw TypeError("offset must be integer or undefined");
                    super(t.span, r || t.property), this.layout = t, this.offset = e
                }
                isCount() {
                    return this.layout instanceof f || this.layout instanceof h
                }
                decode(t, e = 0) {
                    return this.layout.decode(t, e + this.offset)
                }
                encode(t, e, r = 0) {
                    return this.layout.encode(t, e, r + this.offset)
                }
            }
            class f extends s {
                constructor(t, e) {
                    if (super(t, e), 6 < this.span) throw RangeError("span must not exceed 6 bytes")
                }
                decode(t, e = 0) {
                    return o(t).readUIntLE(e, this.span)
                }
                encode(t, e, r = 0) {
                    return o(e).writeUIntLE(t, r, this.span), this.span
                }
            }
            class h extends s {
                constructor(t, e) {
                    if (super(t, e), 6 < this.span) throw RangeError("span must not exceed 6 bytes")
                }
                decode(t, e = 0) {
                    return o(t).readUIntBE(e, this.span)
                }
                encode(t, e, r = 0) {
                    return o(e).writeUIntBE(t, r, this.span), this.span
                }
            }

            function c(t) {
                let e = Math.floor(t / 4294967296);
                return {
                    hi32: e,
                    lo32: t - 4294967296 * e
                }
            }

            function d(t, e) {
                return 4294967296 * t + e
            }
            class p extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e = 0) {
                    let r = o(t),
                        n = r.readUInt32LE(e);
                    return d(r.readUInt32LE(e + 4), n)
                }
                encode(t, e, r = 0) {
                    let n = c(t),
                        i = o(e);
                    return i.writeUInt32LE(n.lo32, r), i.writeUInt32LE(n.hi32, r + 4), 8
                }
            }
            class y extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e = 0) {
                    let r = o(t),
                        n = r.readUInt32LE(e);
                    return d(r.readInt32LE(e + 4), n)
                }
                encode(t, e, r = 0) {
                    let n = c(t),
                        i = o(e);
                    return i.writeUInt32LE(n.lo32, r), i.writeInt32LE(n.hi32, r + 4), 8
                }
            }
            class m extends s {
                constructor(t, e, r) {
                    if (!(t instanceof s)) throw TypeError("elementLayout must be a Layout");
                    if (!(e instanceof a && e.isCount() || Number.isInteger(e) && 0 <= e)) throw TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
                    let n = -1;
                    e instanceof a || !(0 < t.span) || (n = e * t.span), super(n, r), this.elementLayout = t, this.count = e
                }
                getSpan(t, e = 0) {
                    if (0 <= this.span) return this.span;
                    let r = 0,
                        n = this.count;
                    if (n instanceof a && (n = n.decode(t, e)), 0 < this.elementLayout.span) r = n * this.elementLayout.span;
                    else {
                        let i = 0;
                        for (; i < n;) r += this.elementLayout.getSpan(t, e + r), ++i
                    }
                    return r
                }
                decode(t, e = 0) {
                    let r = [],
                        n = 0,
                        i = this.count;
                    for (i instanceof a && (i = i.decode(t, e)); n < i;) r.push(this.elementLayout.decode(t, e)), e += this.elementLayout.getSpan(t, e), n += 1;
                    return r
                }
                encode(t, e, r = 0) {
                    let n = this.elementLayout,
                        i = t.reduce((t, i) => t + n.encode(i, e, r + t), 0);
                    return this.count instanceof a && this.count.encode(t.length, e, r), i
                }
            }
            class g extends s {
                constructor(t, e, r) {
                    if (!(Array.isArray(t) && t.reduce((t, e) => t && e instanceof s, !0))) throw TypeError("fields must be array of Layout instances");
                    for (let n of ("boolean" == typeof e && void 0 === r && (r = e, e = void 0), t))
                        if (0 > n.span && void 0 === n.property) throw Error("fields cannot contain unnamed variable-length layout");
                    let n = -1;
                    try {
                        n = t.reduce((t, e) => t + e.getSpan(), 0)
                    } catch (t) {}
                    super(n, e), this.fields = t, this.decodePrefixes = !!r
                }
                getSpan(t, e = 0) {
                    if (0 <= this.span) return this.span;
                    let r = 0;
                    try {
                        r = this.fields.reduce((r, n) => {
                            let i = n.getSpan(t, e);
                            return e += i, r + i
                        }, 0)
                    } catch (t) {
                        throw RangeError("indeterminate span")
                    }
                    return r
                }
                decode(t, e = 0) {
                    i(t);
                    let r = this.makeDestinationObject();
                    for (let n of this.fields)
                        if (void 0 !== n.property && (r[n.property] = n.decode(t, e)), e += n.getSpan(t, e), this.decodePrefixes && t.length === e) break;
                    return r
                }
                encode(t, e, r = 0) {
                    let n = r,
                        i = 0,
                        o = 0;
                    for (let n of this.fields) {
                        let s = n.span;
                        if (o = 0 < s ? s : 0, void 0 !== n.property) {
                            let i = t[n.property];
                            void 0 !== i && (o = n.encode(i, e, r), 0 > s && (s = n.getSpan(e, r)))
                        }
                        i = r, r += s
                    }
                    return i + o - n
                }
                fromArray(t) {
                    let e = this.makeDestinationObject();
                    for (let r of this.fields) void 0 !== r.property && 0 < t.length && (e[r.property] = t.shift());
                    return e
                }
                layoutFor(t) {
                    if ("string" != typeof t) throw TypeError("property must be string");
                    for (let e of this.fields)
                        if (e.property === t) return e
                }
                offsetOf(t) {
                    if ("string" != typeof t) throw TypeError("property must be string");
                    let e = 0;
                    for (let r of this.fields) {
                        if (r.property === t) return e;
                        0 > r.span ? e = -1 : 0 <= e && (e += r.span)
                    }
                }
            }
            class v {
                constructor(t) {
                    this.property = t
                }
                decode(t, e) {
                    throw Error("UnionDiscriminator is abstract")
                }
                encode(t, e, r) {
                    throw Error("UnionDiscriminator is abstract")
                }
            }
            class w extends v {
                constructor(t, e) {
                    if (!(t instanceof a && t.isCount())) throw TypeError("layout must be an unsigned integer ExternalLayout");
                    super(e || t.property || "variant"), this.layout = t
                }
                decode(t, e) {
                    return this.layout.decode(t, e)
                }
                encode(t, e, r) {
                    return this.layout.encode(t, e, r)
                }
            }
            class b extends s {
                constructor(t, e, r) {
                    let n;
                    if (t instanceof f || t instanceof h) n = new w(new l(t));
                    else if (t instanceof a && t.isCount()) n = new w(t);
                    else if (t instanceof v) n = t;
                    else throw TypeError("discr must be a UnionDiscriminator or an unsigned integer layout");
                    if (void 0 === e && (e = null), !(null === e || e instanceof s)) throw TypeError("defaultLayout must be null or a Layout");
                    if (null !== e) {
                        if (0 > e.span) throw Error("defaultLayout must have constant span");
                        void 0 === e.property && (e = e.replicate("content"))
                    }
                    let i = -1;
                    e && 0 <= (i = e.span) && (t instanceof f || t instanceof h) && (i += n.layout.span), super(i, r), this.discriminator = n, this.usesPrefixDiscriminator = t instanceof f || t instanceof h, this.defaultLayout = e, this.registry = {};
                    let o = this.defaultGetSourceVariant.bind(this);
                    this.getSourceVariant = function(t) {
                        return o(t)
                    }, this.configGetSourceVariant = function(t) {
                        o = t.bind(this)
                    }
                }
                getSpan(t, e = 0) {
                    if (0 <= this.span) return this.span;
                    let r = this.getVariant(t, e);
                    if (!r) throw Error("unable to determine span for unrecognized variant");
                    return r.getSpan(t, e)
                }
                defaultGetSourceVariant(t) {
                    if (Object.prototype.hasOwnProperty.call(t, this.discriminator.property)) {
                        if (this.defaultLayout && this.defaultLayout.property && Object.prototype.hasOwnProperty.call(t, this.defaultLayout.property)) return;
                        let e = this.registry[t[this.discriminator.property]];
                        if (e && (!e.layout || e.property && Object.prototype.hasOwnProperty.call(t, e.property))) return e
                    } else
                        for (let e in this.registry) {
                            let r = this.registry[e];
                            if (r.property && Object.prototype.hasOwnProperty.call(t, r.property)) return r
                        }
                    throw Error("unable to infer src variant")
                }
                decode(t, e = 0) {
                    let r;
                    let n = this.discriminator,
                        i = n.decode(t, e),
                        o = this.registry[i];
                    if (void 0 === o) {
                        let o = this.defaultLayout,
                            s = 0;
                        this.usesPrefixDiscriminator && (s = n.layout.span), (r = this.makeDestinationObject())[n.property] = i, r[o.property] = o.decode(t, e + s)
                    } else r = o.decode(t, e);
                    return r
                }
                encode(t, e, r = 0) {
                    let n = this.getSourceVariant(t);
                    if (void 0 === n) {
                        let n = this.discriminator,
                            i = this.defaultLayout,
                            o = 0;
                        return this.usesPrefixDiscriminator && (o = n.layout.span), n.encode(t[n.property], e, r), o + i.encode(t[i.property], e, r + o)
                    }
                    return n.encode(t, e, r)
                }
                addVariant(t, e, r) {
                    let n = new E(this, t, e, r);
                    return this.registry[t] = n, n
                }
                getVariant(t, e = 0) {
                    let r;
                    return r = t instanceof Uint8Array ? this.discriminator.decode(t, e) : t, this.registry[r]
                }
            }
            class E extends s {
                constructor(t, e, r, n) {
                    if (!(t instanceof b)) throw TypeError("union must be a Union");
                    if (!Number.isInteger(e) || 0 > e) throw TypeError("variant must be a (non-negative) integer");
                    if ("string" == typeof r && void 0 === n && (n = r, r = null), r) {
                        if (!(r instanceof s)) throw TypeError("layout must be a Layout");
                        if (null !== t.defaultLayout && 0 <= r.span && r.span > t.defaultLayout.span) throw Error("variant span exceeds span of containing union");
                        if ("string" != typeof n) throw TypeError("variant must have a String property")
                    }
                    let i = t.span;
                    0 > t.span && 0 <= (i = r ? r.span : 0) && t.usesPrefixDiscriminator && (i += t.discriminator.layout.span), super(i, n), this.union = t, this.variant = e, this.layout = r || null
                }
                getSpan(t, e = 0) {
                    if (0 <= this.span) return this.span;
                    let r = 0;
                    this.union.usesPrefixDiscriminator && (r = this.union.discriminator.layout.span);
                    let n = 0;
                    return this.layout && (n = this.layout.getSpan(t, e + r)), r + n
                }
                decode(t, e = 0) {
                    let r = this.makeDestinationObject();
                    if (this !== this.union.getVariant(t, e)) throw Error("variant mismatch");
                    let n = 0;
                    return this.union.usesPrefixDiscriminator && (n = this.union.discriminator.layout.span), this.layout ? r[this.property] = this.layout.decode(t, e + n) : this.property ? r[this.property] = !0 : this.union.usesPrefixDiscriminator && (r[this.union.discriminator.property] = this.variant), r
                }
                encode(t, e, r = 0) {
                    let n = 0;
                    if (this.union.usesPrefixDiscriminator && (n = this.union.discriminator.layout.span), this.layout && !Object.prototype.hasOwnProperty.call(t, this.property)) throw TypeError("variant lacks property " + this.property);
                    this.union.discriminator.encode(this.variant, e, r);
                    let i = n;
                    if (this.layout && (this.layout.encode(t[this.property], e, r + n), i += this.layout.getSpan(e, r + n), 0 <= this.union.span && i > this.union.span)) throw Error("encoded variant overruns containing union");
                    return i
                }
                fromArray(t) {
                    if (this.layout) return this.layout.fromArray(t)
                }
            }

            function x(t) {
                return 0 > t && (t += 4294967296), t
            }
            class M extends s {
                constructor(t, e, r) {
                    if (!(t instanceof f || t instanceof h)) throw TypeError("word must be a UInt or UIntBE layout");
                    if ("string" == typeof e && void 0 === r && (r = e, e = !1), 4 < t.span) throw RangeError("word cannot exceed 32 bits");
                    super(t.span, r), this.word = t, this.msb = !!e, this.fields = [];
                    let n = 0;
                    this._packedSetValue = function(t) {
                        return n = x(t), this
                    }, this._packedGetValue = function() {
                        return n
                    }
                }
                decode(t, e = 0) {
                    let r = this.makeDestinationObject(),
                        n = this.word.decode(t, e);
                    for (let e of (this._packedSetValue(n), this.fields)) void 0 !== e.property && (r[e.property] = e.decode(t));
                    return r
                }
                encode(t, e, r = 0) {
                    let n = this.word.decode(e, r);
                    for (let e of (this._packedSetValue(n), this.fields))
                        if (void 0 !== e.property) {
                            let r = t[e.property];
                            void 0 !== r && e.encode(r)
                        }
                    return this.word.encode(this._packedGetValue(), e, r)
                }
                addField(t, e) {
                    let r = new _(this, t, e);
                    return this.fields.push(r), r
                }
                addBoolean(t) {
                    let e = new A(this, t);
                    return this.fields.push(e), e
                }
                fieldFor(t) {
                    if ("string" != typeof t) throw TypeError("property must be string");
                    for (let e of this.fields)
                        if (e.property === t) return e
                }
            }
            class _ {
                constructor(t, e, r) {
                    if (!(t instanceof M)) throw TypeError("container must be a BitStructure");
                    if (!Number.isInteger(e) || 0 >= e) throw TypeError("bits must be positive integer");
                    let n = 8 * t.span,
                        i = t.fields.reduce((t, e) => t + e.bits, 0);
                    if (e + i > n) throw Error("bits too long for span remainder (" + (n - i) + " of " + n + " remain)");
                    this.container = t, this.bits = e, this.valueMask = (1 << e) - 1, 32 === e && (this.valueMask = 4294967295), this.start = i, this.container.msb && (this.start = n - i - e), this.wordMask = x(this.valueMask << this.start), this.property = r
                }
                decode(t, e) {
                    return x(this.container._packedGetValue() & this.wordMask) >>> this.start
                }
                encode(t) {
                    if ("number" != typeof t || !Number.isInteger(t) || t !== x(t & this.valueMask)) throw TypeError(u("BitField.encode", this) + " value must be integer not exceeding " + this.valueMask);
                    let e = this.container._packedGetValue(),
                        r = x(t << this.start);
                    this.container._packedSetValue(x(e & ~this.wordMask) | r)
                }
            }
            class A extends _ {
                constructor(t, e) {
                    super(t, 1, e)
                }
                decode(t, e) {
                    return !!super.decode(t, e)
                }
                encode(t) {
                    "boolean" == typeof t && (t = +t), super.encode(t)
                }
            }
            class B extends s {
                constructor(t, e) {
                    if (!(t instanceof a && t.isCount() || Number.isInteger(t) && 0 <= t)) throw TypeError("length must be positive integer or an unsigned integer ExternalLayout");
                    let r = -1;
                    t instanceof a || (r = t), super(r, e), this.length = t
                }
                getSpan(t, e) {
                    let r = this.span;
                    return 0 > r && (r = this.length.decode(t, e)), r
                }
                decode(t, e = 0) {
                    let r = this.span;
                    return 0 > r && (r = this.length.decode(t, e)), o(t).slice(e, e + r)
                }
                encode(t, e, r) {
                    let n = this.length;
                    if (this.length instanceof a && (n = t.length), !(t instanceof Uint8Array && n === t.length)) throw TypeError(u("Blob.encode", this) + " requires (length " + n + ") Uint8Array as src");
                    if (r + n > e.length) throw RangeError("encoding overruns Uint8Array");
                    let i = o(t);
                    return o(e).write(i.toString("hex"), r, n, "hex"), this.length instanceof a && this.length.encode(n, e, r), n
                }
            }
            e.cv = (t, e, r) => new l(t, e, r), e.u8 = t => new f(1, t), e.KB = t => new f(2, t), e.Jq = t => new f(4, t), e._O = t => new p(t), e.gM = t => new y(t), e.n_ = (t, e, r) => new g(t, e, r), e.A9 = (t, e, r) => new m(t, e, r), e.Ik = (t, e) => new B(t, e)
        },
        9282: function(t, e, r) {
            "use strict";
            var n = r(7226).Buffer;
            t.exports = function(t) {
                if (t.length >= 255) throw TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), r = 0; r < e.length; r++) e[r] = 255;
                for (var i = 0; i < t.length; i++) {
                    var o = t.charAt(i),
                        s = o.charCodeAt(0);
                    if (255 !== e[s]) throw TypeError(o + " is ambiguous");
                    e[s] = i
                }
                var u = t.length,
                    a = t.charAt(0),
                    l = Math.log(u) / Math.log(256),
                    f = Math.log(256) / Math.log(u);

                function h(t) {
                    if ("string" != typeof t) throw TypeError("Expected String");
                    if (0 === t.length) return n.alloc(0);
                    for (var r = 0, i = 0, o = 0; t[r] === a;) i++, r++;
                    for (var s = (t.length - r) * l + 1 >>> 0, f = new Uint8Array(s); t[r];) {
                        var h = e[t.charCodeAt(r)];
                        if (255 === h) return;
                        for (var c = 0, d = s - 1;
                            (0 !== h || c < o) && -1 !== d; d--, c++) h += u * f[d] >>> 0, f[d] = h % 256 >>> 0, h = h / 256 >>> 0;
                        if (0 !== h) throw Error("Non-zero carry");
                        o = c, r++
                    }
                    for (var p = s - o; p !== s && 0 === f[p];) p++;
                    var y = n.allocUnsafe(i + (s - p));
                    y.fill(0, 0, i);
                    for (var m = i; p !== s;) y[m++] = f[p++];
                    return y
                }
                return {
                    encode: function(e) {
                        if ((Array.isArray(e) || e instanceof Uint8Array) && (e = n.from(e)), !n.isBuffer(e)) throw TypeError("Expected Buffer");
                        if (0 === e.length) return "";
                        for (var r = 0, i = 0, o = 0, s = e.length; o !== s && 0 === e[o];) o++, r++;
                        for (var l = (s - o) * f + 1 >>> 0, h = new Uint8Array(l); o !== s;) {
                            for (var c = e[o], d = 0, p = l - 1;
                                (0 !== c || d < i) && -1 !== p; p--, d++) c += 256 * h[p] >>> 0, h[p] = c % u >>> 0, c = c / u >>> 0;
                            if (0 !== c) throw Error("Non-zero carry");
                            i = d, o++
                        }
                        for (var y = l - i; y !== l && 0 === h[y];) y++;
                        for (var m = a.repeat(r); y < l; ++y) m += t.charAt(h[y]);
                        return m
                    },
                    decodeUnsafe: h,
                    decode: function(t) {
                        var e = h(t);
                        if (e) return e;
                        throw Error("Non-base" + u + " character")
                    }
                }
            }
        },
        1998: function(t, e, r) {
            var n = r(9282);
            t.exports = n("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        },
        6033: function(t, e) {
            "use strict";
            e.byteLength = function(t) {
                var e = a(t),
                    r = e[0],
                    n = e[1];
                return (r + n) * 3 / 4 - n
            }, e.toByteArray = function(t) {
                var e, r, o = a(t),
                    s = o[0],
                    u = o[1],
                    l = new i((s + u) * 3 / 4 - u),
                    f = 0,
                    h = u > 0 ? s - 4 : s;
                for (r = 0; r < h; r += 4) e = n[t.charCodeAt(r)] << 18 | n[t.charCodeAt(r + 1)] << 12 | n[t.charCodeAt(r + 2)] << 6 | n[t.charCodeAt(r + 3)], l[f++] = e >> 16 & 255, l[f++] = e >> 8 & 255, l[f++] = 255 & e;
                return 2 === u && (e = n[t.charCodeAt(r)] << 2 | n[t.charCodeAt(r + 1)] >> 4, l[f++] = 255 & e), 1 === u && (e = n[t.charCodeAt(r)] << 10 | n[t.charCodeAt(r + 1)] << 4 | n[t.charCodeAt(r + 2)] >> 2, l[f++] = e >> 8 & 255, l[f++] = 255 & e), l
            }, e.fromByteArray = function(t) {
                for (var e, n = t.length, i = n % 3, o = [], s = 0, u = n - i; s < u; s += 16383) o.push(function(t, e, n) {
                    for (var i, o = [], s = e; s < n; s += 3) o.push(r[(i = (t[s] << 16 & 16711680) + (t[s + 1] << 8 & 65280) + (255 & t[s + 2])) >> 18 & 63] + r[i >> 12 & 63] + r[i >> 6 & 63] + r[63 & i]);
                    return o.join("")
                }(t, s, s + 16383 > u ? u : s + 16383));
                return 1 === i ? o.push(r[(e = t[n - 1]) >> 2] + r[e << 4 & 63] + "==") : 2 === i && o.push(r[(e = (t[n - 2] << 8) + t[n - 1]) >> 10] + r[e >> 4 & 63] + r[e << 2 & 63] + "="), o.join("")
            };
            for (var r = [], n = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, u = o.length; s < u; ++s) r[s] = o[s], n[o.charCodeAt(s)] = s;

            function a(t) {
                var e = t.length;
                if (e % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
                var r = t.indexOf("="); - 1 === r && (r = e);
                var n = r === e ? 0 : 4 - r % 4;
                return [r, n]
            }
            n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
        },
        5724: function(t, e, r) {
            "use strict";
            var n = r(3663).Buffer;
            e.oU = function(t) {
                {
                    let e = n.from(t);
                    e.reverse();
                    let r = e.toString("hex");
                    return 0 === r.length ? BigInt(0) : BigInt(`0x${r}`)
                }
            }, e.k$ = function(t, e) {
                {
                    let r = t.toString(16),
                        i = n.from(r.padStart(2 * e, "0").slice(0, 2 * e), "hex");
                    return i.reverse(), i
                }
            }
        },
        4108: function(t, e, r) {
            ! function(t, e) {
                "use strict";

                function n(t, e) {
                    if (!t) throw Error(e || "Assertion failed")
                }

                function i(t, e) {
                    t.super_ = e;
                    var r = function() {};
                    r.prototype = e.prototype, t.prototype = new r, t.prototype.constructor = t
                }

                function o(t, e, r) {
                    if (o.isBN(t)) return t;
                    this.negative = 0, this.words = null, this.length = 0, this.red = null, null !== t && (("le" === e || "be" === e) && (r = e, e = 10), this._init(t || 0, e || 10, r || "be"))
                }
                "object" == typeof t ? t.exports = o : e.BN = o, o.BN = o, o.wordSize = 26;
                try {
                    h = "undefined" != typeof window && void 0 !== window.Buffer ? window.Buffer : r(6601).Buffer
                } catch (t) {}

                function s(t, e) {
                    var r = t.charCodeAt(e);
                    return r >= 48 && r <= 57 ? r - 48 : r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : void n(!1, "Invalid character in " + t)
                }

                function u(t, e, r) {
                    var n = s(t, r);
                    return r - 1 >= e && (n |= s(t, r - 1) << 4), n
                }

                function a(t, e, r, i) {
                    for (var o = 0, s = 0, u = Math.min(t.length, r), a = e; a < u; a++) {
                        var l = t.charCodeAt(a) - 48;
                        o *= i, s = l >= 49 ? l - 49 + 10 : l >= 17 ? l - 17 + 10 : l, n(l >= 0 && s < i, "Invalid character"), o += s
                    }
                    return o
                }

                function l(t, e) {
                    t.words = e.words, t.length = e.length, t.negative = e.negative, t.red = e.red
                }
                if (o.isBN = function(t) {
                        return t instanceof o || null !== t && "object" == typeof t && t.constructor.wordSize === o.wordSize && Array.isArray(t.words)
                    }, o.max = function(t, e) {
                        return t.cmp(e) > 0 ? t : e
                    }, o.min = function(t, e) {
                        return 0 > t.cmp(e) ? t : e
                    }, o.prototype._init = function(t, e, r) {
                        if ("number" == typeof t) return this._initNumber(t, e, r);
                        if ("object" == typeof t) return this._initArray(t, e, r);
                        "hex" === e && (e = 16), n(e === (0 | e) && e >= 2 && e <= 36);
                        var i = 0;
                        "-" === (t = t.toString().replace(/\s+/g, ""))[0] && (i++, this.negative = 1), i < t.length && (16 === e ? this._parseHex(t, i, r) : (this._parseBase(t, e, i), "le" === r && this._initArray(this.toArray(), e, r)))
                    }, o.prototype._initNumber = function(t, e, r) {
                        t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [67108863 & t], this.length = 1) : t < 4503599627370496 ? (this.words = [67108863 & t, t / 67108864 & 67108863], this.length = 2) : (n(t < 9007199254740992), this.words = [67108863 & t, t / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), e, r)
                    }, o.prototype._initArray = function(t, e, r) {
                        if (n("number" == typeof t.length), t.length <= 0) return this.words = [0], this.length = 1, this;
                        this.length = Math.ceil(t.length / 3), this.words = Array(this.length);
                        for (var i, o, s = 0; s < this.length; s++) this.words[s] = 0;
                        var u = 0;
                        if ("be" === r)
                            for (s = t.length - 1, i = 0; s >= 0; s -= 3) o = t[s] | t[s - 1] << 8 | t[s - 2] << 16, this.words[i] |= o << u & 67108863, this.words[i + 1] = o >>> 26 - u & 67108863, (u += 24) >= 26 && (u -= 26, i++);
                        else if ("le" === r)
                            for (s = 0, i = 0; s < t.length; s += 3) o = t[s] | t[s + 1] << 8 | t[s + 2] << 16, this.words[i] |= o << u & 67108863, this.words[i + 1] = o >>> 26 - u & 67108863, (u += 24) >= 26 && (u -= 26, i++);
                        return this._strip()
                    }, o.prototype._parseHex = function(t, e, r) {
                        this.length = Math.ceil((t.length - e) / 6), this.words = Array(this.length);
                        for (var n, i = 0; i < this.length; i++) this.words[i] = 0;
                        var o = 0,
                            s = 0;
                        if ("be" === r)
                            for (i = t.length - 1; i >= e; i -= 2) n = u(t, e, i) << o, this.words[s] |= 67108863 & n, o >= 18 ? (o -= 18, s += 1, this.words[s] |= n >>> 26) : o += 8;
                        else
                            for (i = (t.length - e) % 2 == 0 ? e + 1 : e; i < t.length; i += 2) n = u(t, e, i) << o, this.words[s] |= 67108863 & n, o >= 18 ? (o -= 18, s += 1, this.words[s] |= n >>> 26) : o += 8;
                        this._strip()
                    }, o.prototype._parseBase = function(t, e, r) {
                        this.words = [0], this.length = 1;
                        for (var n = 0, i = 1; i <= 67108863; i *= e) n++;
                        n--, i = i / e | 0;
                        for (var o = t.length - r, s = o % n, u = Math.min(o, o - s) + r, l = 0, f = r; f < u; f += n) l = a(t, f, f + n, e), this.imuln(i), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
                        if (0 !== s) {
                            var h = 1;
                            for (l = a(t, f, t.length, e), f = 0; f < s; f++) h *= e;
                            this.imuln(h), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l)
                        }
                        this._strip()
                    }, o.prototype.copy = function(t) {
                        t.words = Array(this.length);
                        for (var e = 0; e < this.length; e++) t.words[e] = this.words[e];
                        t.length = this.length, t.negative = this.negative, t.red = this.red
                    }, o.prototype._move = function(t) {
                        l(t, this)
                    }, o.prototype.clone = function() {
                        var t = new o(null);
                        return this.copy(t), t
                    }, o.prototype._expand = function(t) {
                        for (; this.length < t;) this.words[this.length++] = 0;
                        return this
                    }, o.prototype._strip = function() {
                        for (; this.length > 1 && 0 === this.words[this.length - 1];) this.length--;
                        return this._normSign()
                    }, o.prototype._normSign = function() {
                        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this
                    }, "undefined" != typeof Symbol && "function" == typeof Symbol.for) try {
                    o.prototype[Symbol.for("nodejs.util.inspect.custom")] = f
                } catch (t) {
                    o.prototype.inspect = f
                } else o.prototype.inspect = f;

                function f() {
                    return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
                }
                var h, c = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
                    d = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                    p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

                function y(t, e, r) {
                    r.negative = e.negative ^ t.negative;
                    var n = t.length + e.length | 0;
                    r.length = n, n = n - 1 | 0;
                    var i = 0 | t.words[0],
                        o = 0 | e.words[0],
                        s = i * o,
                        u = 67108863 & s,
                        a = s / 67108864 | 0;
                    r.words[0] = u;
                    for (var l = 1; l < n; l++) {
                        for (var f = a >>> 26, h = 67108863 & a, c = Math.min(l, e.length - 1), d = Math.max(0, l - t.length + 1); d <= c; d++) {
                            var p = l - d | 0;
                            f += (s = (i = 0 | t.words[p]) * (o = 0 | e.words[d]) + h) / 67108864 | 0, h = 67108863 & s
                        }
                        r.words[l] = 0 | h, a = 0 | f
                    }
                    return 0 !== a ? r.words[l] = 0 | a : r.length--, r._strip()
                }
                o.prototype.toString = function(t, e) {
                    if (e = 0 | e || 1, 16 === (t = t || 10) || "hex" === t) {
                        r = "";
                        for (var r, i = 0, o = 0, s = 0; s < this.length; s++) {
                            var u = this.words[s],
                                a = ((u << i | o) & 16777215).toString(16);
                            o = u >>> 24 - i & 16777215, (i += 2) >= 26 && (i -= 26, s--), r = 0 !== o || s !== this.length - 1 ? c[6 - a.length] + a + r : a + r
                        }
                        for (0 !== o && (r = o.toString(16) + r); r.length % e != 0;) r = "0" + r;
                        return 0 !== this.negative && (r = "-" + r), r
                    }
                    if (t === (0 | t) && t >= 2 && t <= 36) {
                        var l = d[t],
                            f = p[t];
                        r = "";
                        var h = this.clone();
                        for (h.negative = 0; !h.isZero();) {
                            var y = h.modrn(f).toString(t);
                            r = (h = h.idivn(f)).isZero() ? y + r : c[l - y.length] + y + r
                        }
                        for (this.isZero() && (r = "0" + r); r.length % e != 0;) r = "0" + r;
                        return 0 !== this.negative && (r = "-" + r), r
                    }
                    n(!1, "Base should be between 2 and 36")
                }, o.prototype.toNumber = function() {
                    var t = this.words[0];
                    return 2 === this.length ? t += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? t += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && n(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -t : t
                }, o.prototype.toJSON = function() {
                    return this.toString(16, 2)
                }, h && (o.prototype.toBuffer = function(t, e) {
                    return this.toArrayLike(h, t, e)
                }), o.prototype.toArray = function(t, e) {
                    return this.toArrayLike(Array, t, e)
                }, o.prototype.toArrayLike = function(t, e, r) {
                    this._strip();
                    var i = this.byteLength(),
                        o = r || Math.max(1, i);
                    n(i <= o, "byte array longer than desired length"), n(o > 0, "Requested array length <= 0");
                    var s = t.allocUnsafe ? t.allocUnsafe(o) : new t(o);
                    return this["_toArrayLike" + ("le" === e ? "LE" : "BE")](s, i), s
                }, o.prototype._toArrayLikeLE = function(t, e) {
                    for (var r = 0, n = 0, i = 0, o = 0; i < this.length; i++) {
                        var s = this.words[i] << o | n;
                        t[r++] = 255 & s, r < t.length && (t[r++] = s >> 8 & 255), r < t.length && (t[r++] = s >> 16 & 255), 6 === o ? (r < t.length && (t[r++] = s >> 24 & 255), n = 0, o = 0) : (n = s >>> 24, o += 2)
                    }
                    if (r < t.length)
                        for (t[r++] = n; r < t.length;) t[r++] = 0
                }, o.prototype._toArrayLikeBE = function(t, e) {
                    for (var r = t.length - 1, n = 0, i = 0, o = 0; i < this.length; i++) {
                        var s = this.words[i] << o | n;
                        t[r--] = 255 & s, r >= 0 && (t[r--] = s >> 8 & 255), r >= 0 && (t[r--] = s >> 16 & 255), 6 === o ? (r >= 0 && (t[r--] = s >> 24 & 255), n = 0, o = 0) : (n = s >>> 24, o += 2)
                    }
                    if (r >= 0)
                        for (t[r--] = n; r >= 0;) t[r--] = 0
                }, Math.clz32 ? o.prototype._countBits = function(t) {
                    return 32 - Math.clz32(t)
                } : o.prototype._countBits = function(t) {
                    var e = t,
                        r = 0;
                    return e >= 4096 && (r += 13, e >>>= 13), e >= 64 && (r += 7, e >>>= 7), e >= 8 && (r += 4, e >>>= 4), e >= 2 && (r += 2, e >>>= 2), r + e
                }, o.prototype._zeroBits = function(t) {
                    if (0 === t) return 26;
                    var e = t,
                        r = 0;
                    return (8191 & e) == 0 && (r += 13, e >>>= 13), (127 & e) == 0 && (r += 7, e >>>= 7), (15 & e) == 0 && (r += 4, e >>>= 4), (3 & e) == 0 && (r += 2, e >>>= 2), (1 & e) == 0 && r++, r
                }, o.prototype.bitLength = function() {
                    var t = this.words[this.length - 1],
                        e = this._countBits(t);
                    return (this.length - 1) * 26 + e
                }, o.prototype.zeroBits = function() {
                    if (this.isZero()) return 0;
                    for (var t = 0, e = 0; e < this.length; e++) {
                        var r = this._zeroBits(this.words[e]);
                        if (t += r, 26 !== r) break
                    }
                    return t
                }, o.prototype.byteLength = function() {
                    return Math.ceil(this.bitLength() / 8)
                }, o.prototype.toTwos = function(t) {
                    return 0 !== this.negative ? this.abs().inotn(t).iaddn(1) : this.clone()
                }, o.prototype.fromTwos = function(t) {
                    return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone()
                }, o.prototype.isNeg = function() {
                    return 0 !== this.negative
                }, o.prototype.neg = function() {
                    return this.clone().ineg()
                }, o.prototype.ineg = function() {
                    return this.isZero() || (this.negative ^= 1), this
                }, o.prototype.iuor = function(t) {
                    for (; this.length < t.length;) this.words[this.length++] = 0;
                    for (var e = 0; e < t.length; e++) this.words[e] = this.words[e] | t.words[e];
                    return this._strip()
                }, o.prototype.ior = function(t) {
                    return n((this.negative | t.negative) == 0), this.iuor(t)
                }, o.prototype.or = function(t) {
                    return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this)
                }, o.prototype.uor = function(t) {
                    return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this)
                }, o.prototype.iuand = function(t) {
                    var e;
                    e = this.length > t.length ? t : this;
                    for (var r = 0; r < e.length; r++) this.words[r] = this.words[r] & t.words[r];
                    return this.length = e.length, this._strip()
                }, o.prototype.iand = function(t) {
                    return n((this.negative | t.negative) == 0), this.iuand(t)
                }, o.prototype.and = function(t) {
                    return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this)
                }, o.prototype.uand = function(t) {
                    return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this)
                }, o.prototype.iuxor = function(t) {
                    this.length > t.length ? (e = this, r = t) : (e = t, r = this);
                    for (var e, r, n = 0; n < r.length; n++) this.words[n] = e.words[n] ^ r.words[n];
                    if (this !== e)
                        for (; n < e.length; n++) this.words[n] = e.words[n];
                    return this.length = e.length, this._strip()
                }, o.prototype.ixor = function(t) {
                    return n((this.negative | t.negative) == 0), this.iuxor(t)
                }, o.prototype.xor = function(t) {
                    return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this)
                }, o.prototype.uxor = function(t) {
                    return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this)
                }, o.prototype.inotn = function(t) {
                    n("number" == typeof t && t >= 0);
                    var e = 0 | Math.ceil(t / 26),
                        r = t % 26;
                    this._expand(e), r > 0 && e--;
                    for (var i = 0; i < e; i++) this.words[i] = 67108863 & ~this.words[i];
                    return r > 0 && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this._strip()
                }, o.prototype.notn = function(t) {
                    return this.clone().inotn(t)
                }, o.prototype.setn = function(t, e) {
                    n("number" == typeof t && t >= 0);
                    var r = t / 26 | 0,
                        i = t % 26;
                    return this._expand(r + 1), e ? this.words[r] = this.words[r] | 1 << i : this.words[r] = this.words[r] & ~(1 << i), this._strip()
                }, o.prototype.iadd = function(t) {
                    if (0 !== this.negative && 0 === t.negative) return this.negative = 0, e = this.isub(t), this.negative ^= 1, this._normSign();
                    if (0 === this.negative && 0 !== t.negative) return t.negative = 0, e = this.isub(t), t.negative = 1, e._normSign();
                    this.length > t.length ? (r = this, n = t) : (r = t, n = this);
                    for (var e, r, n, i = 0, o = 0; o < n.length; o++) e = (0 | r.words[o]) + (0 | n.words[o]) + i, this.words[o] = 67108863 & e, i = e >>> 26;
                    for (; 0 !== i && o < r.length; o++) e = (0 | r.words[o]) + i, this.words[o] = 67108863 & e, i = e >>> 26;
                    if (this.length = r.length, 0 !== i) this.words[this.length] = i, this.length++;
                    else if (r !== this)
                        for (; o < r.length; o++) this.words[o] = r.words[o];
                    return this
                }, o.prototype.add = function(t) {
                    var e;
                    return 0 !== t.negative && 0 === this.negative ? (t.negative = 0, e = this.sub(t), t.negative ^= 1, e) : 0 === t.negative && 0 !== this.negative ? (this.negative = 0, e = t.sub(this), this.negative = 1, e) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this)
                }, o.prototype.isub = function(t) {
                    if (0 !== t.negative) {
                        t.negative = 0;
                        var e, r, n = this.iadd(t);
                        return t.negative = 1, n._normSign()
                    }
                    if (0 !== this.negative) return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
                    var i = this.cmp(t);
                    if (0 === i) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
                    i > 0 ? (e = this, r = t) : (e = t, r = this);
                    for (var o = 0, s = 0; s < r.length; s++) o = (n = (0 | e.words[s]) - (0 | r.words[s]) + o) >> 26, this.words[s] = 67108863 & n;
                    for (; 0 !== o && s < e.length; s++) o = (n = (0 | e.words[s]) + o) >> 26, this.words[s] = 67108863 & n;
                    if (0 === o && s < e.length && e !== this)
                        for (; s < e.length; s++) this.words[s] = e.words[s];
                    return this.length = Math.max(this.length, s), e !== this && (this.negative = 1), this._strip()
                }, o.prototype.sub = function(t) {
                    return this.clone().isub(t)
                };
                var m = function(t, e, r) {
                    var n, i, o, s = t.words,
                        u = e.words,
                        a = r.words,
                        l = 0,
                        f = 0 | s[0],
                        h = 8191 & f,
                        c = f >>> 13,
                        d = 0 | s[1],
                        p = 8191 & d,
                        y = d >>> 13,
                        m = 0 | s[2],
                        g = 8191 & m,
                        v = m >>> 13,
                        w = 0 | s[3],
                        b = 8191 & w,
                        E = w >>> 13,
                        x = 0 | s[4],
                        M = 8191 & x,
                        _ = x >>> 13,
                        A = 0 | s[5],
                        B = 8191 & A,
                        S = A >>> 13,
                        O = 0 | s[6],
                        I = 8191 & O,
                        k = O >>> 13,
                        L = 0 | s[7],
                        R = 8191 & L,
                        T = L >>> 13,
                        U = 0 | s[8],
                        P = 8191 & U,
                        C = U >>> 13,
                        N = 0 | s[9],
                        j = 8191 & N,
                        q = N >>> 13,
                        F = 0 | u[0],
                        z = 8191 & F,
                        $ = F >>> 13,
                        D = 0 | u[1],
                        Z = 8191 & D,
                        H = D >>> 13,
                        V = 0 | u[2],
                        G = 8191 & V,
                        W = V >>> 13,
                        K = 0 | u[3],
                        Y = 8191 & K,
                        Q = K >>> 13,
                        J = 0 | u[4],
                        X = 8191 & J,
                        tt = J >>> 13,
                        te = 0 | u[5],
                        tr = 8191 & te,
                        tn = te >>> 13,
                        ti = 0 | u[6],
                        to = 8191 & ti,
                        ts = ti >>> 13,
                        tu = 0 | u[7],
                        ta = 8191 & tu,
                        tl = tu >>> 13,
                        tf = 0 | u[8],
                        th = 8191 & tf,
                        tc = tf >>> 13,
                        td = 0 | u[9],
                        tp = 8191 & td,
                        ty = td >>> 13;
                    r.negative = t.negative ^ e.negative, r.length = 19;
                    var tm = (l + (n = Math.imul(h, z)) | 0) + ((8191 & (i = (i = Math.imul(h, $)) + Math.imul(c, z) | 0)) << 13) | 0;
                    l = ((o = Math.imul(c, $)) + (i >>> 13) | 0) + (tm >>> 26) | 0, tm &= 67108863, n = Math.imul(p, z), i = (i = Math.imul(p, $)) + Math.imul(y, z) | 0, o = Math.imul(y, $);
                    var tg = (l + (n = n + Math.imul(h, Z) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, H) | 0) + Math.imul(c, Z) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, H) | 0) + (i >>> 13) | 0) + (tg >>> 26) | 0, tg &= 67108863, n = Math.imul(g, z), i = (i = Math.imul(g, $)) + Math.imul(v, z) | 0, o = Math.imul(v, $), n = n + Math.imul(p, Z) | 0, i = (i = i + Math.imul(p, H) | 0) + Math.imul(y, Z) | 0, o = o + Math.imul(y, H) | 0;
                    var tv = (l + (n = n + Math.imul(h, G) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, W) | 0) + Math.imul(c, G) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, W) | 0) + (i >>> 13) | 0) + (tv >>> 26) | 0, tv &= 67108863, n = Math.imul(b, z), i = (i = Math.imul(b, $)) + Math.imul(E, z) | 0, o = Math.imul(E, $), n = n + Math.imul(g, Z) | 0, i = (i = i + Math.imul(g, H) | 0) + Math.imul(v, Z) | 0, o = o + Math.imul(v, H) | 0, n = n + Math.imul(p, G) | 0, i = (i = i + Math.imul(p, W) | 0) + Math.imul(y, G) | 0, o = o + Math.imul(y, W) | 0;
                    var tw = (l + (n = n + Math.imul(h, Y) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, Q) | 0) + Math.imul(c, Y) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, Q) | 0) + (i >>> 13) | 0) + (tw >>> 26) | 0, tw &= 67108863, n = Math.imul(M, z), i = (i = Math.imul(M, $)) + Math.imul(_, z) | 0, o = Math.imul(_, $), n = n + Math.imul(b, Z) | 0, i = (i = i + Math.imul(b, H) | 0) + Math.imul(E, Z) | 0, o = o + Math.imul(E, H) | 0, n = n + Math.imul(g, G) | 0, i = (i = i + Math.imul(g, W) | 0) + Math.imul(v, G) | 0, o = o + Math.imul(v, W) | 0, n = n + Math.imul(p, Y) | 0, i = (i = i + Math.imul(p, Q) | 0) + Math.imul(y, Y) | 0, o = o + Math.imul(y, Q) | 0;
                    var tb = (l + (n = n + Math.imul(h, X) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, tt) | 0) + Math.imul(c, X) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, tt) | 0) + (i >>> 13) | 0) + (tb >>> 26) | 0, tb &= 67108863, n = Math.imul(B, z), i = (i = Math.imul(B, $)) + Math.imul(S, z) | 0, o = Math.imul(S, $), n = n + Math.imul(M, Z) | 0, i = (i = i + Math.imul(M, H) | 0) + Math.imul(_, Z) | 0, o = o + Math.imul(_, H) | 0, n = n + Math.imul(b, G) | 0, i = (i = i + Math.imul(b, W) | 0) + Math.imul(E, G) | 0, o = o + Math.imul(E, W) | 0, n = n + Math.imul(g, Y) | 0, i = (i = i + Math.imul(g, Q) | 0) + Math.imul(v, Y) | 0, o = o + Math.imul(v, Q) | 0, n = n + Math.imul(p, X) | 0, i = (i = i + Math.imul(p, tt) | 0) + Math.imul(y, X) | 0, o = o + Math.imul(y, tt) | 0;
                    var tE = (l + (n = n + Math.imul(h, tr) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, tn) | 0) + Math.imul(c, tr) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, tn) | 0) + (i >>> 13) | 0) + (tE >>> 26) | 0, tE &= 67108863, n = Math.imul(I, z), i = (i = Math.imul(I, $)) + Math.imul(k, z) | 0, o = Math.imul(k, $), n = n + Math.imul(B, Z) | 0, i = (i = i + Math.imul(B, H) | 0) + Math.imul(S, Z) | 0, o = o + Math.imul(S, H) | 0, n = n + Math.imul(M, G) | 0, i = (i = i + Math.imul(M, W) | 0) + Math.imul(_, G) | 0, o = o + Math.imul(_, W) | 0, n = n + Math.imul(b, Y) | 0, i = (i = i + Math.imul(b, Q) | 0) + Math.imul(E, Y) | 0, o = o + Math.imul(E, Q) | 0, n = n + Math.imul(g, X) | 0, i = (i = i + Math.imul(g, tt) | 0) + Math.imul(v, X) | 0, o = o + Math.imul(v, tt) | 0, n = n + Math.imul(p, tr) | 0, i = (i = i + Math.imul(p, tn) | 0) + Math.imul(y, tr) | 0, o = o + Math.imul(y, tn) | 0;
                    var tx = (l + (n = n + Math.imul(h, to) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ts) | 0) + Math.imul(c, to) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, ts) | 0) + (i >>> 13) | 0) + (tx >>> 26) | 0, tx &= 67108863, n = Math.imul(R, z), i = (i = Math.imul(R, $)) + Math.imul(T, z) | 0, o = Math.imul(T, $), n = n + Math.imul(I, Z) | 0, i = (i = i + Math.imul(I, H) | 0) + Math.imul(k, Z) | 0, o = o + Math.imul(k, H) | 0, n = n + Math.imul(B, G) | 0, i = (i = i + Math.imul(B, W) | 0) + Math.imul(S, G) | 0, o = o + Math.imul(S, W) | 0, n = n + Math.imul(M, Y) | 0, i = (i = i + Math.imul(M, Q) | 0) + Math.imul(_, Y) | 0, o = o + Math.imul(_, Q) | 0, n = n + Math.imul(b, X) | 0, i = (i = i + Math.imul(b, tt) | 0) + Math.imul(E, X) | 0, o = o + Math.imul(E, tt) | 0, n = n + Math.imul(g, tr) | 0, i = (i = i + Math.imul(g, tn) | 0) + Math.imul(v, tr) | 0, o = o + Math.imul(v, tn) | 0, n = n + Math.imul(p, to) | 0, i = (i = i + Math.imul(p, ts) | 0) + Math.imul(y, to) | 0, o = o + Math.imul(y, ts) | 0;
                    var tM = (l + (n = n + Math.imul(h, ta) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, tl) | 0) + Math.imul(c, ta) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, tl) | 0) + (i >>> 13) | 0) + (tM >>> 26) | 0, tM &= 67108863, n = Math.imul(P, z), i = (i = Math.imul(P, $)) + Math.imul(C, z) | 0, o = Math.imul(C, $), n = n + Math.imul(R, Z) | 0, i = (i = i + Math.imul(R, H) | 0) + Math.imul(T, Z) | 0, o = o + Math.imul(T, H) | 0, n = n + Math.imul(I, G) | 0, i = (i = i + Math.imul(I, W) | 0) + Math.imul(k, G) | 0, o = o + Math.imul(k, W) | 0, n = n + Math.imul(B, Y) | 0, i = (i = i + Math.imul(B, Q) | 0) + Math.imul(S, Y) | 0, o = o + Math.imul(S, Q) | 0, n = n + Math.imul(M, X) | 0, i = (i = i + Math.imul(M, tt) | 0) + Math.imul(_, X) | 0, o = o + Math.imul(_, tt) | 0, n = n + Math.imul(b, tr) | 0, i = (i = i + Math.imul(b, tn) | 0) + Math.imul(E, tr) | 0, o = o + Math.imul(E, tn) | 0, n = n + Math.imul(g, to) | 0, i = (i = i + Math.imul(g, ts) | 0) + Math.imul(v, to) | 0, o = o + Math.imul(v, ts) | 0, n = n + Math.imul(p, ta) | 0, i = (i = i + Math.imul(p, tl) | 0) + Math.imul(y, ta) | 0, o = o + Math.imul(y, tl) | 0;
                    var t_ = (l + (n = n + Math.imul(h, th) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, tc) | 0) + Math.imul(c, th) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, tc) | 0) + (i >>> 13) | 0) + (t_ >>> 26) | 0, t_ &= 67108863, n = Math.imul(j, z), i = (i = Math.imul(j, $)) + Math.imul(q, z) | 0, o = Math.imul(q, $), n = n + Math.imul(P, Z) | 0, i = (i = i + Math.imul(P, H) | 0) + Math.imul(C, Z) | 0, o = o + Math.imul(C, H) | 0, n = n + Math.imul(R, G) | 0, i = (i = i + Math.imul(R, W) | 0) + Math.imul(T, G) | 0, o = o + Math.imul(T, W) | 0, n = n + Math.imul(I, Y) | 0, i = (i = i + Math.imul(I, Q) | 0) + Math.imul(k, Y) | 0, o = o + Math.imul(k, Q) | 0, n = n + Math.imul(B, X) | 0, i = (i = i + Math.imul(B, tt) | 0) + Math.imul(S, X) | 0, o = o + Math.imul(S, tt) | 0, n = n + Math.imul(M, tr) | 0, i = (i = i + Math.imul(M, tn) | 0) + Math.imul(_, tr) | 0, o = o + Math.imul(_, tn) | 0, n = n + Math.imul(b, to) | 0, i = (i = i + Math.imul(b, ts) | 0) + Math.imul(E, to) | 0, o = o + Math.imul(E, ts) | 0, n = n + Math.imul(g, ta) | 0, i = (i = i + Math.imul(g, tl) | 0) + Math.imul(v, ta) | 0, o = o + Math.imul(v, tl) | 0, n = n + Math.imul(p, th) | 0, i = (i = i + Math.imul(p, tc) | 0) + Math.imul(y, th) | 0, o = o + Math.imul(y, tc) | 0;
                    var tA = (l + (n = n + Math.imul(h, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(h, ty) | 0) + Math.imul(c, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(c, ty) | 0) + (i >>> 13) | 0) + (tA >>> 26) | 0, tA &= 67108863, n = Math.imul(j, Z), i = (i = Math.imul(j, H)) + Math.imul(q, Z) | 0, o = Math.imul(q, H), n = n + Math.imul(P, G) | 0, i = (i = i + Math.imul(P, W) | 0) + Math.imul(C, G) | 0, o = o + Math.imul(C, W) | 0, n = n + Math.imul(R, Y) | 0, i = (i = i + Math.imul(R, Q) | 0) + Math.imul(T, Y) | 0, o = o + Math.imul(T, Q) | 0, n = n + Math.imul(I, X) | 0, i = (i = i + Math.imul(I, tt) | 0) + Math.imul(k, X) | 0, o = o + Math.imul(k, tt) | 0, n = n + Math.imul(B, tr) | 0, i = (i = i + Math.imul(B, tn) | 0) + Math.imul(S, tr) | 0, o = o + Math.imul(S, tn) | 0, n = n + Math.imul(M, to) | 0, i = (i = i + Math.imul(M, ts) | 0) + Math.imul(_, to) | 0, o = o + Math.imul(_, ts) | 0, n = n + Math.imul(b, ta) | 0, i = (i = i + Math.imul(b, tl) | 0) + Math.imul(E, ta) | 0, o = o + Math.imul(E, tl) | 0, n = n + Math.imul(g, th) | 0, i = (i = i + Math.imul(g, tc) | 0) + Math.imul(v, th) | 0, o = o + Math.imul(v, tc) | 0;
                    var tB = (l + (n = n + Math.imul(p, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(p, ty) | 0) + Math.imul(y, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(y, ty) | 0) + (i >>> 13) | 0) + (tB >>> 26) | 0, tB &= 67108863, n = Math.imul(j, G), i = (i = Math.imul(j, W)) + Math.imul(q, G) | 0, o = Math.imul(q, W), n = n + Math.imul(P, Y) | 0, i = (i = i + Math.imul(P, Q) | 0) + Math.imul(C, Y) | 0, o = o + Math.imul(C, Q) | 0, n = n + Math.imul(R, X) | 0, i = (i = i + Math.imul(R, tt) | 0) + Math.imul(T, X) | 0, o = o + Math.imul(T, tt) | 0, n = n + Math.imul(I, tr) | 0, i = (i = i + Math.imul(I, tn) | 0) + Math.imul(k, tr) | 0, o = o + Math.imul(k, tn) | 0, n = n + Math.imul(B, to) | 0, i = (i = i + Math.imul(B, ts) | 0) + Math.imul(S, to) | 0, o = o + Math.imul(S, ts) | 0, n = n + Math.imul(M, ta) | 0, i = (i = i + Math.imul(M, tl) | 0) + Math.imul(_, ta) | 0, o = o + Math.imul(_, tl) | 0, n = n + Math.imul(b, th) | 0, i = (i = i + Math.imul(b, tc) | 0) + Math.imul(E, th) | 0, o = o + Math.imul(E, tc) | 0;
                    var tS = (l + (n = n + Math.imul(g, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(g, ty) | 0) + Math.imul(v, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(v, ty) | 0) + (i >>> 13) | 0) + (tS >>> 26) | 0, tS &= 67108863, n = Math.imul(j, Y), i = (i = Math.imul(j, Q)) + Math.imul(q, Y) | 0, o = Math.imul(q, Q), n = n + Math.imul(P, X) | 0, i = (i = i + Math.imul(P, tt) | 0) + Math.imul(C, X) | 0, o = o + Math.imul(C, tt) | 0, n = n + Math.imul(R, tr) | 0, i = (i = i + Math.imul(R, tn) | 0) + Math.imul(T, tr) | 0, o = o + Math.imul(T, tn) | 0, n = n + Math.imul(I, to) | 0, i = (i = i + Math.imul(I, ts) | 0) + Math.imul(k, to) | 0, o = o + Math.imul(k, ts) | 0, n = n + Math.imul(B, ta) | 0, i = (i = i + Math.imul(B, tl) | 0) + Math.imul(S, ta) | 0, o = o + Math.imul(S, tl) | 0, n = n + Math.imul(M, th) | 0, i = (i = i + Math.imul(M, tc) | 0) + Math.imul(_, th) | 0, o = o + Math.imul(_, tc) | 0;
                    var tO = (l + (n = n + Math.imul(b, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(b, ty) | 0) + Math.imul(E, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(E, ty) | 0) + (i >>> 13) | 0) + (tO >>> 26) | 0, tO &= 67108863, n = Math.imul(j, X), i = (i = Math.imul(j, tt)) + Math.imul(q, X) | 0, o = Math.imul(q, tt), n = n + Math.imul(P, tr) | 0, i = (i = i + Math.imul(P, tn) | 0) + Math.imul(C, tr) | 0, o = o + Math.imul(C, tn) | 0, n = n + Math.imul(R, to) | 0, i = (i = i + Math.imul(R, ts) | 0) + Math.imul(T, to) | 0, o = o + Math.imul(T, ts) | 0, n = n + Math.imul(I, ta) | 0, i = (i = i + Math.imul(I, tl) | 0) + Math.imul(k, ta) | 0, o = o + Math.imul(k, tl) | 0, n = n + Math.imul(B, th) | 0, i = (i = i + Math.imul(B, tc) | 0) + Math.imul(S, th) | 0, o = o + Math.imul(S, tc) | 0;
                    var tI = (l + (n = n + Math.imul(M, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(M, ty) | 0) + Math.imul(_, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(_, ty) | 0) + (i >>> 13) | 0) + (tI >>> 26) | 0, tI &= 67108863, n = Math.imul(j, tr), i = (i = Math.imul(j, tn)) + Math.imul(q, tr) | 0, o = Math.imul(q, tn), n = n + Math.imul(P, to) | 0, i = (i = i + Math.imul(P, ts) | 0) + Math.imul(C, to) | 0, o = o + Math.imul(C, ts) | 0, n = n + Math.imul(R, ta) | 0, i = (i = i + Math.imul(R, tl) | 0) + Math.imul(T, ta) | 0, o = o + Math.imul(T, tl) | 0, n = n + Math.imul(I, th) | 0, i = (i = i + Math.imul(I, tc) | 0) + Math.imul(k, th) | 0, o = o + Math.imul(k, tc) | 0;
                    var tk = (l + (n = n + Math.imul(B, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(B, ty) | 0) + Math.imul(S, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(S, ty) | 0) + (i >>> 13) | 0) + (tk >>> 26) | 0, tk &= 67108863, n = Math.imul(j, to), i = (i = Math.imul(j, ts)) + Math.imul(q, to) | 0, o = Math.imul(q, ts), n = n + Math.imul(P, ta) | 0, i = (i = i + Math.imul(P, tl) | 0) + Math.imul(C, ta) | 0, o = o + Math.imul(C, tl) | 0, n = n + Math.imul(R, th) | 0, i = (i = i + Math.imul(R, tc) | 0) + Math.imul(T, th) | 0, o = o + Math.imul(T, tc) | 0;
                    var tL = (l + (n = n + Math.imul(I, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(I, ty) | 0) + Math.imul(k, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(k, ty) | 0) + (i >>> 13) | 0) + (tL >>> 26) | 0, tL &= 67108863, n = Math.imul(j, ta), i = (i = Math.imul(j, tl)) + Math.imul(q, ta) | 0, o = Math.imul(q, tl), n = n + Math.imul(P, th) | 0, i = (i = i + Math.imul(P, tc) | 0) + Math.imul(C, th) | 0, o = o + Math.imul(C, tc) | 0;
                    var tR = (l + (n = n + Math.imul(R, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(R, ty) | 0) + Math.imul(T, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(T, ty) | 0) + (i >>> 13) | 0) + (tR >>> 26) | 0, tR &= 67108863, n = Math.imul(j, th), i = (i = Math.imul(j, tc)) + Math.imul(q, th) | 0, o = Math.imul(q, tc);
                    var tT = (l + (n = n + Math.imul(P, tp) | 0) | 0) + ((8191 & (i = (i = i + Math.imul(P, ty) | 0) + Math.imul(C, tp) | 0)) << 13) | 0;
                    l = ((o = o + Math.imul(C, ty) | 0) + (i >>> 13) | 0) + (tT >>> 26) | 0, tT &= 67108863;
                    var tU = (l + (n = Math.imul(j, tp)) | 0) + ((8191 & (i = (i = Math.imul(j, ty)) + Math.imul(q, tp) | 0)) << 13) | 0;
                    return l = ((o = Math.imul(q, ty)) + (i >>> 13) | 0) + (tU >>> 26) | 0, tU &= 67108863, a[0] = tm, a[1] = tg, a[2] = tv, a[3] = tw, a[4] = tb, a[5] = tE, a[6] = tx, a[7] = tM, a[8] = t_, a[9] = tA, a[10] = tB, a[11] = tS, a[12] = tO, a[13] = tI, a[14] = tk, a[15] = tL, a[16] = tR, a[17] = tT, a[18] = tU, 0 !== l && (a[19] = l, r.length++), r
                };

                function g(t, e, r) {
                    r.negative = e.negative ^ t.negative, r.length = t.length + e.length;
                    for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
                        var s = i;
                        i = 0;
                        for (var u = 67108863 & n, a = Math.min(o, e.length - 1), l = Math.max(0, o - t.length + 1); l <= a; l++) {
                            var f = o - l,
                                h = (0 | t.words[f]) * (0 | e.words[l]),
                                c = 67108863 & h;
                            s = s + (h / 67108864 | 0) | 0, u = 67108863 & (c = c + u | 0), i += (s = s + (c >>> 26) | 0) >>> 26, s &= 67108863
                        }
                        r.words[o] = u, n = s, s = i
                    }
                    return 0 !== n ? r.words[o] = n : r.length--, r._strip()
                }

                function v(t, e) {
                    this.x = t, this.y = e
                }
                Math.imul || (m = y), o.prototype.mulTo = function(t, e) {
                    var r, n = this.length + t.length;
                    return 10 === this.length && 10 === t.length ? m(this, t, e) : n < 63 ? y(this, t, e) : g(this, t, e)
                }, v.prototype.makeRBT = function(t) {
                    for (var e = Array(t), r = o.prototype._countBits(t) - 1, n = 0; n < t; n++) e[n] = this.revBin(n, r, t);
                    return e
                }, v.prototype.revBin = function(t, e, r) {
                    if (0 === t || t === r - 1) return t;
                    for (var n = 0, i = 0; i < e; i++) n |= (1 & t) << e - i - 1, t >>= 1;
                    return n
                }, v.prototype.permute = function(t, e, r, n, i, o) {
                    for (var s = 0; s < o; s++) n[s] = e[t[s]], i[s] = r[t[s]]
                }, v.prototype.transform = function(t, e, r, n, i, o) {
                    this.permute(o, t, e, r, n, i);
                    for (var s = 1; s < i; s <<= 1)
                        for (var u = s << 1, a = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), f = 0; f < i; f += u)
                            for (var h = a, c = l, d = 0; d < s; d++) {
                                var p = r[f + d],
                                    y = n[f + d],
                                    m = r[f + d + s],
                                    g = n[f + d + s],
                                    v = h * m - c * g;
                                g = h * g + c * m, m = v, r[f + d] = p + m, n[f + d] = y + g, r[f + d + s] = p - m, n[f + d + s] = y - g, d !== u && (v = a * h - l * c, c = a * c + l * h, h = v)
                            }
                }, v.prototype.guessLen13b = function(t, e) {
                    var r = 1 | Math.max(e, t),
                        n = 1 & r,
                        i = 0;
                    for (r = r / 2 | 0; r; r >>>= 1) i++;
                    return 1 << i + 1 + n
                }, v.prototype.conjugate = function(t, e, r) {
                    if (!(r <= 1))
                        for (var n = 0; n < r / 2; n++) {
                            var i = t[n];
                            t[n] = t[r - n - 1], t[r - n - 1] = i, i = e[n], e[n] = -e[r - n - 1], e[r - n - 1] = -i
                        }
                }, v.prototype.normalize13b = function(t, e) {
                    for (var r = 0, n = 0; n < e / 2; n++) {
                        var i = 8192 * Math.round(t[2 * n + 1] / e) + Math.round(t[2 * n] / e) + r;
                        t[n] = 67108863 & i, r = i < 67108864 ? 0 : i / 67108864 | 0
                    }
                    return t
                }, v.prototype.convert13b = function(t, e, r, i) {
                    for (var o = 0, s = 0; s < e; s++) o += 0 | t[s], r[2 * s] = 8191 & o, o >>>= 13, r[2 * s + 1] = 8191 & o, o >>>= 13;
                    for (s = 2 * e; s < i; ++s) r[s] = 0;
                    n(0 === o), n((-8192 & o) == 0)
                }, v.prototype.stub = function(t) {
                    for (var e = Array(t), r = 0; r < t; r++) e[r] = 0;
                    return e
                }, v.prototype.mulp = function(t, e, r) {
                    var n = 2 * this.guessLen13b(t.length, e.length),
                        i = this.makeRBT(n),
                        o = this.stub(n),
                        s = Array(n),
                        u = Array(n),
                        a = Array(n),
                        l = Array(n),
                        f = Array(n),
                        h = Array(n),
                        c = r.words;
                    c.length = n, this.convert13b(t.words, t.length, s, n), this.convert13b(e.words, e.length, l, n), this.transform(s, o, u, a, n, i), this.transform(l, o, f, h, n, i);
                    for (var d = 0; d < n; d++) {
                        var p = u[d] * f[d] - a[d] * h[d];
                        a[d] = u[d] * h[d] + a[d] * f[d], u[d] = p
                    }
                    return this.conjugate(u, a, n), this.transform(u, a, c, o, n, i), this.conjugate(c, o, n), this.normalize13b(c, n), r.negative = t.negative ^ e.negative, r.length = t.length + e.length, r._strip()
                }, o.prototype.mul = function(t) {
                    var e = new o(null);
                    return e.words = Array(this.length + t.length), this.mulTo(t, e)
                }, o.prototype.mulf = function(t) {
                    var e = new o(null);
                    return e.words = Array(this.length + t.length), g(this, t, e)
                }, o.prototype.imul = function(t) {
                    return this.clone().mulTo(t, this)
                }, o.prototype.imuln = function(t) {
                    var e = t < 0;
                    e && (t = -t), n("number" == typeof t), n(t < 67108864);
                    for (var r = 0, i = 0; i < this.length; i++) {
                        var o = (0 | this.words[i]) * t,
                            s = (67108863 & o) + (67108863 & r);
                        r >>= 26, r += (o / 67108864 | 0) + (s >>> 26), this.words[i] = 67108863 & s
                    }
                    return 0 !== r && (this.words[i] = r, this.length++), e ? this.ineg() : this
                }, o.prototype.muln = function(t) {
                    return this.clone().imuln(t)
                }, o.prototype.sqr = function() {
                    return this.mul(this)
                }, o.prototype.isqr = function() {
                    return this.imul(this.clone())
                }, o.prototype.pow = function(t) {
                    var e = function(t) {
                        for (var e = Array(t.bitLength()), r = 0; r < e.length; r++) {
                            var n = r / 26 | 0,
                                i = r % 26;
                            e[r] = t.words[n] >>> i & 1
                        }
                        return e
                    }(t);
                    if (0 === e.length) return new o(1);
                    for (var r = this, n = 0; n < e.length && 0 === e[n]; n++, r = r.sqr());
                    if (++n < e.length)
                        for (var i = r.sqr(); n < e.length; n++, i = i.sqr()) 0 !== e[n] && (r = r.mul(i));
                    return r
                }, o.prototype.iushln = function(t) {
                    n("number" == typeof t && t >= 0);
                    var e, r = t % 26,
                        i = (t - r) / 26,
                        o = 67108863 >>> 26 - r << 26 - r;
                    if (0 !== r) {
                        var s = 0;
                        for (e = 0; e < this.length; e++) {
                            var u = this.words[e] & o,
                                a = (0 | this.words[e]) - u << r;
                            this.words[e] = a | s, s = u >>> 26 - r
                        }
                        s && (this.words[e] = s, this.length++)
                    }
                    if (0 !== i) {
                        for (e = this.length - 1; e >= 0; e--) this.words[e + i] = this.words[e];
                        for (e = 0; e < i; e++) this.words[e] = 0;
                        this.length += i
                    }
                    return this._strip()
                }, o.prototype.ishln = function(t) {
                    return n(0 === this.negative), this.iushln(t)
                }, o.prototype.iushrn = function(t, e, r) {
                    n("number" == typeof t && t >= 0), i = e ? (e - e % 26) / 26 : 0;
                    var i, o = t % 26,
                        s = Math.min((t - o) / 26, this.length),
                        u = 67108863 ^ 67108863 >>> o << o;
                    if (i -= s, i = Math.max(0, i), r) {
                        for (var a = 0; a < s; a++) r.words[a] = this.words[a];
                        r.length = s
                    }
                    if (0 === s);
                    else if (this.length > s)
                        for (this.length -= s, a = 0; a < this.length; a++) this.words[a] = this.words[a + s];
                    else this.words[0] = 0, this.length = 1;
                    var l = 0;
                    for (a = this.length - 1; a >= 0 && (0 !== l || a >= i); a--) {
                        var f = 0 | this.words[a];
                        this.words[a] = l << 26 - o | f >>> o, l = f & u
                    }
                    return r && 0 !== l && (r.words[r.length++] = l), 0 === this.length && (this.words[0] = 0, this.length = 1), this._strip()
                }, o.prototype.ishrn = function(t, e, r) {
                    return n(0 === this.negative), this.iushrn(t, e, r)
                }, o.prototype.shln = function(t) {
                    return this.clone().ishln(t)
                }, o.prototype.ushln = function(t) {
                    return this.clone().iushln(t)
                }, o.prototype.shrn = function(t) {
                    return this.clone().ishrn(t)
                }, o.prototype.ushrn = function(t) {
                    return this.clone().iushrn(t)
                }, o.prototype.testn = function(t) {
                    n("number" == typeof t && t >= 0);
                    var e = t % 26,
                        r = (t - e) / 26;
                    return !(this.length <= r) && !!(this.words[r] & 1 << e)
                }, o.prototype.imaskn = function(t) {
                    n("number" == typeof t && t >= 0);
                    var e = t % 26,
                        r = (t - e) / 26;
                    return (n(0 === this.negative, "imaskn works only with positive numbers"), this.length <= r) ? this : (0 !== e && r++, this.length = Math.min(r, this.length), 0 !== e && (this.words[this.length - 1] &= 67108863 ^ 67108863 >>> e << e), this._strip())
                }, o.prototype.maskn = function(t) {
                    return this.clone().imaskn(t)
                }, o.prototype.iaddn = function(t) {
                    return (n("number" == typeof t), n(t < 67108864), t < 0) ? this.isubn(-t) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) <= t ? (this.words[0] = t - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(t), this.negative = 1), this) : this._iaddn(t)
                }, o.prototype._iaddn = function(t) {
                    this.words[0] += t;
                    for (var e = 0; e < this.length && this.words[e] >= 67108864; e++) this.words[e] -= 67108864, e === this.length - 1 ? this.words[e + 1] = 1 : this.words[e + 1]++;
                    return this.length = Math.max(this.length, e + 1), this
                }, o.prototype.isubn = function(t) {
                    if (n("number" == typeof t), n(t < 67108864), t < 0) return this.iaddn(-t);
                    if (0 !== this.negative) return this.negative = 0, this.iaddn(t), this.negative = 1, this;
                    if (this.words[0] -= t, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1;
                    else
                        for (var e = 0; e < this.length && this.words[e] < 0; e++) this.words[e] += 67108864, this.words[e + 1] -= 1;
                    return this._strip()
                }, o.prototype.addn = function(t) {
                    return this.clone().iaddn(t)
                }, o.prototype.subn = function(t) {
                    return this.clone().isubn(t)
                }, o.prototype.iabs = function() {
                    return this.negative = 0, this
                }, o.prototype.abs = function() {
                    return this.clone().iabs()
                }, o.prototype._ishlnsubmul = function(t, e, r) {
                    var i, o, s = t.length + r;
                    this._expand(s);
                    var u = 0;
                    for (i = 0; i < t.length; i++) {
                        o = (0 | this.words[i + r]) + u;
                        var a = (0 | t.words[i]) * e;
                        o -= 67108863 & a, u = (o >> 26) - (a / 67108864 | 0), this.words[i + r] = 67108863 & o
                    }
                    for (; i < this.length - r; i++) u = (o = (0 | this.words[i + r]) + u) >> 26, this.words[i + r] = 67108863 & o;
                    if (0 === u) return this._strip();
                    for (n(-1 === u), u = 0, i = 0; i < this.length; i++) u = (o = -(0 | this.words[i]) + u) >> 26, this.words[i] = 67108863 & o;
                    return this.negative = 1, this._strip()
                }, o.prototype._wordDiv = function(t, e) {
                    var r, n = this.length - t.length,
                        i = this.clone(),
                        s = t,
                        u = 0 | s.words[s.length - 1];
                    0 != (n = 26 - this._countBits(u)) && (s = s.ushln(n), i.iushln(n), u = 0 | s.words[s.length - 1]);
                    var a = i.length - s.length;
                    if ("mod" !== e) {
                        (r = new o(null)).length = a + 1, r.words = Array(r.length);
                        for (var l = 0; l < r.length; l++) r.words[l] = 0
                    }
                    var f = i.clone()._ishlnsubmul(s, 1, a);
                    0 === f.negative && (i = f, r && (r.words[a] = 1));
                    for (var h = a - 1; h >= 0; h--) {
                        var c = (0 | i.words[s.length + h]) * 67108864 + (0 | i.words[s.length + h - 1]);
                        for (c = Math.min(c / u | 0, 67108863), i._ishlnsubmul(s, c, h); 0 !== i.negative;) c--, i.negative = 0, i._ishlnsubmul(s, 1, h), i.isZero() || (i.negative ^= 1);
                        r && (r.words[h] = c)
                    }
                    return r && r._strip(), i._strip(), "div" !== e && 0 !== n && i.iushrn(n), {
                        div: r || null,
                        mod: i
                    }
                }, o.prototype.divmod = function(t, e, r) {
                    var i, s, u;
                    return (n(!t.isZero()), this.isZero()) ? {
                        div: new o(0),
                        mod: new o(0)
                    } : 0 !== this.negative && 0 === t.negative ? (u = this.neg().divmod(t, e), "mod" !== e && (i = u.div.neg()), "div" !== e && (s = u.mod.neg(), r && 0 !== s.negative && s.iadd(t)), {
                        div: i,
                        mod: s
                    }) : 0 === this.negative && 0 !== t.negative ? (u = this.divmod(t.neg(), e), "mod" !== e && (i = u.div.neg()), {
                        div: i,
                        mod: u.mod
                    }) : (this.negative & t.negative) != 0 ? (u = this.neg().divmod(t.neg(), e), "div" !== e && (s = u.mod.neg(), r && 0 !== s.negative && s.isub(t)), {
                        div: u.div,
                        mod: s
                    }) : t.length > this.length || 0 > this.cmp(t) ? {
                        div: new o(0),
                        mod: this
                    } : 1 === t.length ? "div" === e ? {
                        div: this.divn(t.words[0]),
                        mod: null
                    } : "mod" === e ? {
                        div: null,
                        mod: new o(this.modrn(t.words[0]))
                    } : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modrn(t.words[0]))
                    } : this._wordDiv(t, e)
                }, o.prototype.div = function(t) {
                    return this.divmod(t, "div", !1).div
                }, o.prototype.mod = function(t) {
                    return this.divmod(t, "mod", !1).mod
                }, o.prototype.umod = function(t) {
                    return this.divmod(t, "mod", !0).mod
                }, o.prototype.divRound = function(t) {
                    var e = this.divmod(t);
                    if (e.mod.isZero()) return e.div;
                    var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                        n = t.ushrn(1),
                        i = t.andln(1),
                        o = r.cmp(n);
                    return o < 0 || 1 === i && 0 === o ? e.div : 0 !== e.div.negative ? e.div.isubn(1) : e.div.iaddn(1)
                }, o.prototype.modrn = function(t) {
                    var e = t < 0;
                    e && (t = -t), n(t <= 67108863);
                    for (var r = 67108864 % t, i = 0, o = this.length - 1; o >= 0; o--) i = (r * i + (0 | this.words[o])) % t;
                    return e ? -i : i
                }, o.prototype.modn = function(t) {
                    return this.modrn(t)
                }, o.prototype.idivn = function(t) {
                    var e = t < 0;
                    e && (t = -t), n(t <= 67108863);
                    for (var r = 0, i = this.length - 1; i >= 0; i--) {
                        var o = (0 | this.words[i]) + 67108864 * r;
                        this.words[i] = o / t | 0, r = o % t
                    }
                    return this._strip(), e ? this.ineg() : this
                }, o.prototype.divn = function(t) {
                    return this.clone().idivn(t)
                }, o.prototype.egcd = function(t) {
                    n(0 === t.negative), n(!t.isZero());
                    var e = this,
                        r = t.clone();
                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                    for (var i = new o(1), s = new o(0), u = new o(0), a = new o(1), l = 0; e.isEven() && r.isEven();) e.iushrn(1), r.iushrn(1), ++l;
                    for (var f = r.clone(), h = e.clone(); !e.isZero();) {
                        for (var c = 0, d = 1;
                            (e.words[0] & d) == 0 && c < 26; ++c, d <<= 1);
                        if (c > 0)
                            for (e.iushrn(c); c-- > 0;)(i.isOdd() || s.isOdd()) && (i.iadd(f), s.isub(h)), i.iushrn(1), s.iushrn(1);
                        for (var p = 0, y = 1;
                            (r.words[0] & y) == 0 && p < 26; ++p, y <<= 1);
                        if (p > 0)
                            for (r.iushrn(p); p-- > 0;)(u.isOdd() || a.isOdd()) && (u.iadd(f), a.isub(h)), u.iushrn(1), a.iushrn(1);
                        e.cmp(r) >= 0 ? (e.isub(r), i.isub(u), s.isub(a)) : (r.isub(e), u.isub(i), a.isub(s))
                    }
                    return {
                        a: u,
                        b: a,
                        gcd: r.iushln(l)
                    }
                }, o.prototype._invmp = function(t) {
                    n(0 === t.negative), n(!t.isZero());
                    var e, r = this,
                        i = t.clone();
                    r = 0 !== r.negative ? r.umod(t) : r.clone();
                    for (var s = new o(1), u = new o(0), a = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0;) {
                        for (var l = 0, f = 1;
                            (r.words[0] & f) == 0 && l < 26; ++l, f <<= 1);
                        if (l > 0)
                            for (r.iushrn(l); l-- > 0;) s.isOdd() && s.iadd(a), s.iushrn(1);
                        for (var h = 0, c = 1;
                            (i.words[0] & c) == 0 && h < 26; ++h, c <<= 1);
                        if (h > 0)
                            for (i.iushrn(h); h-- > 0;) u.isOdd() && u.iadd(a), u.iushrn(1);
                        r.cmp(i) >= 0 ? (r.isub(i), s.isub(u)) : (i.isub(r), u.isub(s))
                    }
                    return 0 > (e = 0 === r.cmpn(1) ? s : u).cmpn(0) && e.iadd(t), e
                }, o.prototype.gcd = function(t) {
                    if (this.isZero()) return t.abs();
                    if (t.isZero()) return this.abs();
                    var e = this.clone(),
                        r = t.clone();
                    e.negative = 0, r.negative = 0;
                    for (var n = 0; e.isEven() && r.isEven(); n++) e.iushrn(1), r.iushrn(1);
                    for (;;) {
                        for (; e.isEven();) e.iushrn(1);
                        for (; r.isEven();) r.iushrn(1);
                        var i = e.cmp(r);
                        if (i < 0) {
                            var o = e;
                            e = r, r = o
                        } else if (0 === i || 0 === r.cmpn(1)) break;
                        e.isub(r)
                    }
                    return r.iushln(n)
                }, o.prototype.invm = function(t) {
                    return this.egcd(t).a.umod(t)
                }, o.prototype.isEven = function() {
                    return (1 & this.words[0]) == 0
                }, o.prototype.isOdd = function() {
                    return (1 & this.words[0]) == 1
                }, o.prototype.andln = function(t) {
                    return this.words[0] & t
                }, o.prototype.bincn = function(t) {
                    n("number" == typeof t);
                    var e = t % 26,
                        r = (t - e) / 26,
                        i = 1 << e;
                    if (this.length <= r) return this._expand(r + 1), this.words[r] |= i, this;
                    for (var o = i, s = r; 0 !== o && s < this.length; s++) {
                        var u = 0 | this.words[s];
                        u += o, o = u >>> 26, u &= 67108863, this.words[s] = u
                    }
                    return 0 !== o && (this.words[s] = o, this.length++), this
                }, o.prototype.isZero = function() {
                    return 1 === this.length && 0 === this.words[0]
                }, o.prototype.cmpn = function(t) {
                    var e, r = t < 0;
                    if (0 !== this.negative && !r) return -1;
                    if (0 === this.negative && r) return 1;
                    if (this._strip(), this.length > 1) e = 1;
                    else {
                        r && (t = -t), n(t <= 67108863, "Number is too big");
                        var i = 0 | this.words[0];
                        e = i === t ? 0 : i < t ? -1 : 1
                    }
                    return 0 !== this.negative ? 0 | -e : e
                }, o.prototype.cmp = function(t) {
                    if (0 !== this.negative && 0 === t.negative) return -1;
                    if (0 === this.negative && 0 !== t.negative) return 1;
                    var e = this.ucmp(t);
                    return 0 !== this.negative ? 0 | -e : e
                }, o.prototype.ucmp = function(t) {
                    if (this.length > t.length) return 1;
                    if (this.length < t.length) return -1;
                    for (var e = 0, r = this.length - 1; r >= 0; r--) {
                        var n = 0 | this.words[r],
                            i = 0 | t.words[r];
                        if (n !== i) {
                            n < i ? e = -1 : n > i && (e = 1);
                            break
                        }
                    }
                    return e
                }, o.prototype.gtn = function(t) {
                    return 1 === this.cmpn(t)
                }, o.prototype.gt = function(t) {
                    return 1 === this.cmp(t)
                }, o.prototype.gten = function(t) {
                    return this.cmpn(t) >= 0
                }, o.prototype.gte = function(t) {
                    return this.cmp(t) >= 0
                }, o.prototype.ltn = function(t) {
                    return -1 === this.cmpn(t)
                }, o.prototype.lt = function(t) {
                    return -1 === this.cmp(t)
                }, o.prototype.lten = function(t) {
                    return 0 >= this.cmpn(t)
                }, o.prototype.lte = function(t) {
                    return 0 >= this.cmp(t)
                }, o.prototype.eqn = function(t) {
                    return 0 === this.cmpn(t)
                }, o.prototype.eq = function(t) {
                    return 0 === this.cmp(t)
                }, o.red = function(t) {
                    return new A(t)
                }, o.prototype.toRed = function(t) {
                    return n(!this.red, "Already a number in reduction context"), n(0 === this.negative, "red works only with positives"), t.convertTo(this)._forceRed(t)
                }, o.prototype.fromRed = function() {
                    return n(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
                }, o.prototype._forceRed = function(t) {
                    return this.red = t, this
                }, o.prototype.forceRed = function(t) {
                    return n(!this.red, "Already a number in reduction context"), this._forceRed(t)
                }, o.prototype.redAdd = function(t) {
                    return n(this.red, "redAdd works only with red numbers"), this.red.add(this, t)
                }, o.prototype.redIAdd = function(t) {
                    return n(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t)
                }, o.prototype.redSub = function(t) {
                    return n(this.red, "redSub works only with red numbers"), this.red.sub(this, t)
                }, o.prototype.redISub = function(t) {
                    return n(this.red, "redISub works only with red numbers"), this.red.isub(this, t)
                }, o.prototype.redShl = function(t) {
                    return n(this.red, "redShl works only with red numbers"), this.red.shl(this, t)
                }, o.prototype.redMul = function(t) {
                    return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t)
                }, o.prototype.redIMul = function(t) {
                    return n(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t)
                }, o.prototype.redSqr = function() {
                    return n(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
                }, o.prototype.redISqr = function() {
                    return n(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
                }, o.prototype.redSqrt = function() {
                    return n(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
                }, o.prototype.redInvm = function() {
                    return n(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
                }, o.prototype.redNeg = function() {
                    return n(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
                }, o.prototype.redPow = function(t) {
                    return n(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t)
                };
                var w = {
                    k256: null,
                    p224: null,
                    p192: null,
                    p25519: null
                };

                function b(t, e) {
                    this.name = t, this.p = new o(e, 16), this.n = this.p.bitLength(), this.k = new o(1).iushln(this.n).isub(this.p), this.tmp = this._tmp()
                }

                function E() {
                    b.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
                }

                function x() {
                    b.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
                }

                function M() {
                    b.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
                }

                function _() {
                    b.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
                }

                function A(t) {
                    if ("string" == typeof t) {
                        var e = o._prime(t);
                        this.m = e.p, this.prime = e
                    } else n(t.gtn(1), "modulus must be greater than 1"), this.m = t, this.prime = null
                }

                function B(t) {
                    A.call(this, t), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new o(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv)
                }
                b.prototype._tmp = function() {
                    var t = new o(null);
                    return t.words = Array(Math.ceil(this.n / 13)), t
                }, b.prototype.ireduce = function(t) {
                    var e, r = t;
                    do this.split(r, this.tmp), e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength(); while (e > this.n);
                    var n = e < this.n ? -1 : r.ucmp(this.p);
                    return 0 === n ? (r.words[0] = 0, r.length = 1) : n > 0 ? r.isub(this.p) : void 0 !== r.strip ? r.strip() : r._strip(), r
                }, b.prototype.split = function(t, e) {
                    t.iushrn(this.n, 0, e)
                }, b.prototype.imulK = function(t) {
                    return t.imul(this.k)
                }, i(E, b), E.prototype.split = function(t, e) {
                    for (var r = Math.min(t.length, 9), n = 0; n < r; n++) e.words[n] = t.words[n];
                    if (e.length = r, t.length <= 9) {
                        t.words[0] = 0, t.length = 1;
                        return
                    }
                    var i = t.words[9];
                    for (n = 10, e.words[e.length++] = 4194303 & i; n < t.length; n++) {
                        var o = 0 | t.words[n];
                        t.words[n - 10] = (4194303 & o) << 4 | i >>> 22, i = o
                    }
                    i >>>= 22, t.words[n - 10] = i, 0 === i && t.length > 10 ? t.length -= 10 : t.length -= 9
                }, E.prototype.imulK = function(t) {
                    t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
                    for (var e = 0, r = 0; r < t.length; r++) {
                        var n = 0 | t.words[r];
                        e += 977 * n, t.words[r] = 67108863 & e, e = 64 * n + (e / 67108864 | 0)
                    }
                    return 0 === t.words[t.length - 1] && (t.length--, 0 === t.words[t.length - 1] && t.length--), t
                }, i(x, b), i(M, b), i(_, b), _.prototype.imulK = function(t) {
                    for (var e = 0, r = 0; r < t.length; r++) {
                        var n = (0 | t.words[r]) * 19 + e,
                            i = 67108863 & n;
                        n >>>= 26, t.words[r] = i, e = n
                    }
                    return 0 !== e && (t.words[t.length++] = e), t
                }, o._prime = function(t) {
                    var e;
                    if (w[t]) return w[t];
                    if ("k256" === t) e = new E;
                    else if ("p224" === t) e = new x;
                    else if ("p192" === t) e = new M;
                    else if ("p25519" === t) e = new _;
                    else throw Error("Unknown prime " + t);
                    return w[t] = e, e
                }, A.prototype._verify1 = function(t) {
                    n(0 === t.negative, "red works only with positives"), n(t.red, "red works only with red numbers")
                }, A.prototype._verify2 = function(t, e) {
                    n((t.negative | e.negative) == 0, "red works only with positives"), n(t.red && t.red === e.red, "red works only with red numbers")
                }, A.prototype.imod = function(t) {
                    return this.prime ? this.prime.ireduce(t)._forceRed(this) : (l(t, t.umod(this.m)._forceRed(this)), t)
                }, A.prototype.neg = function(t) {
                    return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this)
                }, A.prototype.add = function(t, e) {
                    this._verify2(t, e);
                    var r = t.add(e);
                    return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this)
                }, A.prototype.iadd = function(t, e) {
                    this._verify2(t, e);
                    var r = t.iadd(e);
                    return r.cmp(this.m) >= 0 && r.isub(this.m), r
                }, A.prototype.sub = function(t, e) {
                    this._verify2(t, e);
                    var r = t.sub(e);
                    return 0 > r.cmpn(0) && r.iadd(this.m), r._forceRed(this)
                }, A.prototype.isub = function(t, e) {
                    this._verify2(t, e);
                    var r = t.isub(e);
                    return 0 > r.cmpn(0) && r.iadd(this.m), r
                }, A.prototype.shl = function(t, e) {
                    return this._verify1(t), this.imod(t.ushln(e))
                }, A.prototype.imul = function(t, e) {
                    return this._verify2(t, e), this.imod(t.imul(e))
                }, A.prototype.mul = function(t, e) {
                    return this._verify2(t, e), this.imod(t.mul(e))
                }, A.prototype.isqr = function(t) {
                    return this.imul(t, t.clone())
                }, A.prototype.sqr = function(t) {
                    return this.mul(t, t)
                }, A.prototype.sqrt = function(t) {
                    if (t.isZero()) return t.clone();
                    var e = this.m.andln(3);
                    if (n(e % 2 == 1), 3 === e) {
                        var r = this.m.add(new o(1)).iushrn(2);
                        return this.pow(t, r)
                    }
                    for (var i = this.m.subn(1), s = 0; !i.isZero() && 0 === i.andln(1);) s++, i.iushrn(1);
                    n(!i.isZero());
                    var u = new o(1).toRed(this),
                        a = u.redNeg(),
                        l = this.m.subn(1).iushrn(1),
                        f = this.m.bitLength();
                    for (f = new o(2 * f * f).toRed(this); 0 !== this.pow(f, l).cmp(a);) f.redIAdd(a);
                    for (var h = this.pow(f, i), c = this.pow(t, i.addn(1).iushrn(1)), d = this.pow(t, i), p = s; 0 !== d.cmp(u);) {
                        for (var y = d, m = 0; 0 !== y.cmp(u); m++) y = y.redSqr();
                        n(m < p);
                        var g = this.pow(h, new o(1).iushln(p - m - 1));
                        c = c.redMul(g), h = g.redSqr(), d = d.redMul(h), p = m
                    }
                    return c
                }, A.prototype.invm = function(t) {
                    var e = t._invmp(this.m);
                    return 0 !== e.negative ? (e.negative = 0, this.imod(e).redNeg()) : this.imod(e)
                }, A.prototype.pow = function(t, e) {
                    if (e.isZero()) return new o(1).toRed(this);
                    if (0 === e.cmpn(1)) return t.clone();
                    var r = Array(16);
                    r[0] = new o(1).toRed(this), r[1] = t;
                    for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], t);
                    var i = r[0],
                        s = 0,
                        u = 0,
                        a = e.bitLength() % 26;
                    for (0 === a && (a = 26), n = e.length - 1; n >= 0; n--) {
                        for (var l = e.words[n], f = a - 1; f >= 0; f--) {
                            var h = l >> f & 1;
                            if (i !== r[0] && (i = this.sqr(i)), 0 === h && 0 === s) {
                                u = 0;
                                continue
                            }
                            s <<= 1, s |= h, (4 == ++u || 0 === n && 0 === f) && (i = this.mul(i, r[s]), u = 0, s = 0)
                        }
                        a = 26
                    }
                    return i
                }, A.prototype.convertTo = function(t) {
                    var e = t.umod(this.m);
                    return e === t ? e.clone() : e
                }, A.prototype.convertFrom = function(t) {
                    var e = t.clone();
                    return e.red = null, e
                }, o.mont = function(t) {
                    return new B(t)
                }, i(B, A), B.prototype.convertTo = function(t) {
                    return this.imod(t.ushln(this.shift))
                }, B.prototype.convertFrom = function(t) {
                    var e = this.imod(t.mul(this.rinv));
                    return e.red = null, e
                }, B.prototype.imul = function(t, e) {
                    if (t.isZero() || e.isZero()) return t.words[0] = 0, t.length = 1, t;
                    var r = t.imul(e),
                        n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                        i = r.isub(n).iushrn(this.shift),
                        o = i;
                    return i.cmp(this.m) >= 0 ? o = i.isub(this.m) : 0 > i.cmpn(0) && (o = i.iadd(this.m)), o._forceRed(this)
                }, B.prototype.mul = function(t, e) {
                    if (t.isZero() || e.isZero()) return new o(0)._forceRed(this);
                    var r = t.mul(e),
                        n = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                        i = r.isub(n).iushrn(this.shift),
                        s = i;
                    return i.cmp(this.m) >= 0 ? s = i.isub(this.m) : 0 > i.cmpn(0) && (s = i.iadd(this.m)), s._forceRed(this)
                }, B.prototype.invm = function(t) {
                    return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)
                }
            }(t = r.nmd(t), this)
        },
        4072: function(t, e, r) {
            "use strict";
            var n = r(3663).Buffer,
                i = this && this.__createBinding || (Object.create ? function(t, e, r, n) {
                    void 0 === n && (n = r), Object.defineProperty(t, n, {
                        enumerable: !0,
                        get: function() {
                            return e[r]
                        }
                    })
                } : function(t, e, r, n) {
                    void 0 === n && (n = r), t[n] = e[r]
                }),
                o = this && this.__setModuleDefault || (Object.create ? function(t, e) {
                    Object.defineProperty(t, "default", {
                        enumerable: !0,
                        value: e
                    })
                } : function(t, e) {
                    t.default = e
                }),
                s = this && this.__decorate || function(t, e, r, n) {
                    var i, o = arguments.length,
                        s = o < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, n);
                    else
                        for (var u = t.length - 1; u >= 0; u--)(i = t[u]) && (s = (o < 3 ? i(s) : o > 3 ? i(e, r, s) : i(e, r)) || s);
                    return o > 3 && s && Object.defineProperty(e, r, s), s
                },
                u = this && this.__importStar || function(t) {
                    if (t && t.__esModule) return t;
                    var e = {};
                    if (null != t)
                        for (var r in t) "default" !== r && Object.hasOwnProperty.call(t, r) && i(e, t, r);
                    return o(e, t), e
                },
                a = this && this.__importDefault || function(t) {
                    return t && t.__esModule ? t : {
                        default: t
                    }
                };
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.deserializeUnchecked = e.deserialize = e.serialize = e.BinaryReader = e.BinaryWriter = e.BorshError = e.baseDecode = e.baseEncode = void 0;
            let l = a(r(4108)),
                f = a(r(3092)),
                h = u(r(6908)),
                c = new("function" != typeof TextDecoder ? h.TextDecoder : TextDecoder)("utf-8", {
                    fatal: !0
                });
            e.baseEncode = function(t) {
                return "string" == typeof t && (t = n.from(t, "utf8")), f.default.encode(n.from(t))
            }, e.baseDecode = function(t) {
                return n.from(f.default.decode(t))
            };
            class d extends Error {
                constructor(t) {
                    super(t), this.fieldPath = [], this.originalMessage = t
                }
                addToFieldPath(t) {
                    this.fieldPath.splice(0, 0, t), this.message = this.originalMessage + ": " + this.fieldPath.join(".")
                }
            }
            e.BorshError = d;
            class p {
                constructor() {
                    this.buf = n.alloc(1024), this.length = 0
                }
                maybeResize() {
                    this.buf.length < 16 + this.length && (this.buf = n.concat([this.buf, n.alloc(1024)]))
                }
                writeU8(t) {
                    this.maybeResize(), this.buf.writeUInt8(t, this.length), this.length += 1
                }
                writeU16(t) {
                    this.maybeResize(), this.buf.writeUInt16LE(t, this.length), this.length += 2
                }
                writeU32(t) {
                    this.maybeResize(), this.buf.writeUInt32LE(t, this.length), this.length += 4
                }
                writeU64(t) {
                    this.maybeResize(), this.writeBuffer(n.from(new l.default(t).toArray("le", 8)))
                }
                writeU128(t) {
                    this.maybeResize(), this.writeBuffer(n.from(new l.default(t).toArray("le", 16)))
                }
                writeU256(t) {
                    this.maybeResize(), this.writeBuffer(n.from(new l.default(t).toArray("le", 32)))
                }
                writeU512(t) {
                    this.maybeResize(), this.writeBuffer(n.from(new l.default(t).toArray("le", 64)))
                }
                writeBuffer(t) {
                    this.buf = n.concat([n.from(this.buf.subarray(0, this.length)), t, n.alloc(1024)]), this.length += t.length
                }
                writeString(t) {
                    this.maybeResize();
                    let e = n.from(t, "utf8");
                    this.writeU32(e.length), this.writeBuffer(e)
                }
                writeFixedArray(t) {
                    this.writeBuffer(n.from(t))
                }
                writeArray(t, e) {
                    for (let r of (this.maybeResize(), this.writeU32(t.length), t)) this.maybeResize(), e(r)
                }
                toArray() {
                    return this.buf.subarray(0, this.length)
                }
            }

            function y(t, e, r) {
                let n = r.value;
                r.value = function(...t) {
                    try {
                        return n.apply(this, t)
                    } catch (t) {
                        if (t instanceof RangeError && ["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(t.code) >= 0) throw new d("Reached the end of buffer when deserializing");
                        throw t
                    }
                }
            }
            e.BinaryWriter = p;
            class m {
                constructor(t) {
                    this.buf = t, this.offset = 0
                }
                readU8() {
                    let t = this.buf.readUInt8(this.offset);
                    return this.offset += 1, t
                }
                readU16() {
                    let t = this.buf.readUInt16LE(this.offset);
                    return this.offset += 2, t
                }
                readU32() {
                    let t = this.buf.readUInt32LE(this.offset);
                    return this.offset += 4, t
                }
                readU64() {
                    let t = this.readBuffer(8);
                    return new l.default(t, "le")
                }
                readU128() {
                    let t = this.readBuffer(16);
                    return new l.default(t, "le")
                }
                readU256() {
                    let t = this.readBuffer(32);
                    return new l.default(t, "le")
                }
                readU512() {
                    let t = this.readBuffer(64);
                    return new l.default(t, "le")
                }
                readBuffer(t) {
                    if (this.offset + t > this.buf.length) throw new d(`Expected buffer length ${t} isn't within bounds`);
                    let e = this.buf.slice(this.offset, this.offset + t);
                    return this.offset += t, e
                }
                readString() {
                    let t = this.readU32(),
                        e = this.readBuffer(t);
                    try {
                        return c.decode(e)
                    } catch (t) {
                        throw new d(`Error decoding UTF-8 string: ${t}`)
                    }
                }
                readFixedArray(t) {
                    return new Uint8Array(this.readBuffer(t))
                }
                readArray(t) {
                    let e = this.readU32(),
                        r = [];
                    for (let n = 0; n < e; ++n) r.push(t());
                    return r
                }
            }

            function g(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            }

            function v(t, e, r, n, i) {
                try {
                    if ("string" == typeof n) i[`write${g(n)}`](r);
                    else if (n instanceof Array) {
                        if ("number" == typeof n[0]) {
                            if (r.length !== n[0]) throw new d(`Expecting byte array of length ${n[0]}, but got ${r.length} bytes`);
                            i.writeFixedArray(r)
                        } else if (2 === n.length && "number" == typeof n[1]) {
                            if (r.length !== n[1]) throw new d(`Expecting byte array of length ${n[1]}, but got ${r.length} bytes`);
                            for (let e = 0; e < n[1]; e++) v(t, null, r[e], n[0], i)
                        } else i.writeArray(r, r => {
                            v(t, e, r, n[0], i)
                        })
                    } else if (void 0 !== n.kind) switch (n.kind) {
                        case "option":
                            null == r ? i.writeU8(0) : (i.writeU8(1), v(t, e, r, n.type, i));
                            break;
                        case "map":
                            i.writeU32(r.size), r.forEach((r, o) => {
                                v(t, e, o, n.key, i), v(t, e, r, n.value, i)
                            });
                            break;
                        default:
                            throw new d(`FieldType ${n} unrecognized`)
                    } else w(t, r, i)
                } catch (t) {
                    throw t instanceof d && t.addToFieldPath(e), t
                }
            }

            function w(t, e, r) {
                if ("function" == typeof e.borshSerialize) {
                    e.borshSerialize(r);
                    return
                }
                let n = t.get(e.constructor);
                if (!n) throw new d(`Class ${e.constructor.name} is missing in schema`);
                if ("struct" === n.kind) n.fields.map(([n, i]) => {
                    v(t, n, e[n], i, r)
                });
                else if ("enum" === n.kind) {
                    let i = e[n.field];
                    for (let o = 0; o < n.values.length; ++o) {
                        let [s, u] = n.values[o];
                        if (s === i) {
                            r.writeU8(o), v(t, s, e[s], u, r);
                            break
                        }
                    }
                } else throw new d(`Unexpected schema kind: ${n.kind} for ${e.constructor.name}`)
            }

            function b(t, e, r, n) {
                try {
                    if ("string" == typeof r) return n[`read${g(r)}`]();
                    if (r instanceof Array) {
                        if ("number" == typeof r[0]) return n.readFixedArray(r[0]);
                        if ("number" != typeof r[1]) return n.readArray(() => b(t, e, r[0], n)); {
                            let e = [];
                            for (let i = 0; i < r[1]; i++) e.push(b(t, null, r[0], n));
                            return e
                        }
                    }
                    if ("option" === r.kind) {
                        if (n.readU8()) return b(t, e, r.type, n);
                        return
                    }
                    if ("map" === r.kind) {
                        let i = new Map,
                            o = n.readU32();
                        for (let s = 0; s < o; s++) {
                            let o = b(t, e, r.key, n),
                                s = b(t, e, r.value, n);
                            i.set(o, s)
                        }
                        return i
                    }
                    return E(t, r, n)
                } catch (t) {
                    throw t instanceof d && t.addToFieldPath(e), t
                }
            }

            function E(t, e, r) {
                if ("function" == typeof e.borshDeserialize) return e.borshDeserialize(r);
                let n = t.get(e);
                if (!n) throw new d(`Class ${e.name} is missing in schema`);
                if ("struct" === n.kind) {
                    let n = {};
                    for (let [i, o] of t.get(e).fields) n[i] = b(t, i, o, r);
                    return new e(n)
                }
                if ("enum" === n.kind) {
                    let i = r.readU8();
                    if (i >= n.values.length) throw new d(`Enum index: ${i} is out of range`);
                    let [o, s] = n.values[i], u = b(t, o, s, r);
                    return new e({
                        [o]: u
                    })
                }
                throw new d(`Unexpected schema kind: ${n.kind} for ${e.constructor.name}`)
            }
            s([y], m.prototype, "readU8", null), s([y], m.prototype, "readU16", null), s([y], m.prototype, "readU32", null), s([y], m.prototype, "readU64", null), s([y], m.prototype, "readU128", null), s([y], m.prototype, "readU256", null), s([y], m.prototype, "readU512", null), s([y], m.prototype, "readString", null), s([y], m.prototype, "readFixedArray", null), s([y], m.prototype, "readArray", null), e.BinaryReader = m, e.serialize = function(t, e, r = p) {
                let n = new r;
                return w(t, e, n), n.toArray()
            }, e.deserialize = function(t, e, r, n = m) {
                let i = new n(r),
                    o = E(t, e, i);
                if (i.offset < r.length) throw new d(`Unexpected ${r.length-i.offset} bytes after deserialized data`);
                return o
            }, e.deserializeUnchecked = function(t, e, r, n = m) {
                return E(t, e, new n(r))
            }
        },
        4813: function(t, e, r) {
            "use strict";
            var n = r(7226).Buffer;
            t.exports = function(t) {
                if (t.length >= 255) throw TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), r = 0; r < e.length; r++) e[r] = 255;
                for (var i = 0; i < t.length; i++) {
                    var o = t.charAt(i),
                        s = o.charCodeAt(0);
                    if (255 !== e[s]) throw TypeError(o + " is ambiguous");
                    e[s] = i
                }
                var u = t.length,
                    a = t.charAt(0),
                    l = Math.log(u) / Math.log(256),
                    f = Math.log(256) / Math.log(u);

                function h(t) {
                    if ("string" != typeof t) throw TypeError("Expected String");
                    if (0 === t.length) return n.alloc(0);
                    for (var r = 0, i = 0, o = 0; t[r] === a;) i++, r++;
                    for (var s = (t.length - r) * l + 1 >>> 0, f = new Uint8Array(s); t[r];) {
                        var h = e[t.charCodeAt(r)];
                        if (255 === h) return;
                        for (var c = 0, d = s - 1;
                            (0 !== h || c < o) && -1 !== d; d--, c++) h += u * f[d] >>> 0, f[d] = h % 256 >>> 0, h = h / 256 >>> 0;
                        if (0 !== h) throw Error("Non-zero carry");
                        o = c, r++
                    }
                    for (var p = s - o; p !== s && 0 === f[p];) p++;
                    var y = n.allocUnsafe(i + (s - p));
                    y.fill(0, 0, i);
                    for (var m = i; p !== s;) y[m++] = f[p++];
                    return y
                }
                return {
                    encode: function(e) {
                        if ((Array.isArray(e) || e instanceof Uint8Array) && (e = n.from(e)), !n.isBuffer(e)) throw TypeError("Expected Buffer");
                        if (0 === e.length) return "";
                        for (var r = 0, i = 0, o = 0, s = e.length; o !== s && 0 === e[o];) o++, r++;
                        for (var l = (s - o) * f + 1 >>> 0, h = new Uint8Array(l); o !== s;) {
                            for (var c = e[o], d = 0, p = l - 1;
                                (0 !== c || d < i) && -1 !== p; p--, d++) c += 256 * h[p] >>> 0, h[p] = c % u >>> 0, c = c / u >>> 0;
                            if (0 !== c) throw Error("Non-zero carry");
                            i = d, o++
                        }
                        for (var y = l - i; y !== l && 0 === h[y];) y++;
                        for (var m = a.repeat(r); y < l; ++y) m += t.charAt(h[y]);
                        return m
                    },
                    decodeUnsafe: h,
                    decode: function(t) {
                        var e = h(t);
                        if (e) return e;
                        throw Error("Non-base" + u + " character")
                    }
                }
            }
        },
        3092: function(t, e, r) {
            var n = r(4813);
            t.exports = n("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        },
        3663: function(t, e, r) {
            "use strict";
            /*!
             * The buffer module from node.js, for the browser.
             *
             * @author   Feross Aboukhadijeh <https://feross.org>
             * @license  MIT
             */
            let n = r(6033),
                i = r(1531),
                o = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;

            function s(t) {
                if (t > 2147483647) throw RangeError('The value "' + t + '" is invalid for option "size"');
                let e = new Uint8Array(t);
                return Object.setPrototypeOf(e, u.prototype), e
            }

            function u(t, e, r) {
                if ("number" == typeof t) {
                    if ("string" == typeof e) throw TypeError('The "string" argument must be of type string. Received type number');
                    return f(t)
                }
                return a(t, e, r)
            }

            function a(t, e, r) {
                if ("string" == typeof t) return function(t, e) {
                    if (("string" != typeof e || "" === e) && (e = "utf8"), !u.isEncoding(e)) throw TypeError("Unknown encoding: " + e);
                    let r = 0 | p(t, e),
                        n = s(r),
                        i = n.write(t, e);
                    return i !== r && (n = n.slice(0, i)), n
                }(t, e);
                if (ArrayBuffer.isView(t)) return function(t) {
                    if (N(t, Uint8Array)) {
                        let e = new Uint8Array(t);
                        return c(e.buffer, e.byteOffset, e.byteLength)
                    }
                    return h(t)
                }(t);
                if (null == t) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
                if (N(t, ArrayBuffer) || t && N(t.buffer, ArrayBuffer) || "undefined" != typeof SharedArrayBuffer && (N(t, SharedArrayBuffer) || t && N(t.buffer, SharedArrayBuffer))) return c(t, e, r);
                if ("number" == typeof t) throw TypeError('The "value" argument must not be of type number. Received type number');
                let n = t.valueOf && t.valueOf();
                if (null != n && n !== t) return u.from(n, e, r);
                let i = function(t) {
                    var e;
                    if (u.isBuffer(t)) {
                        let e = 0 | d(t.length),
                            r = s(e);
                        return 0 === r.length || t.copy(r, 0, 0, e), r
                    }
                    return void 0 !== t.length ? "number" != typeof t.length || (e = t.length) != e ? s(0) : h(t) : "Buffer" === t.type && Array.isArray(t.data) ? h(t.data) : void 0
                }(t);
                if (i) return i;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive]) return u.from(t[Symbol.toPrimitive]("string"), e, r);
                throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
            }

            function l(t) {
                if ("number" != typeof t) throw TypeError('"size" argument must be of type number');
                if (t < 0) throw RangeError('The value "' + t + '" is invalid for option "size"')
            }

            function f(t) {
                return l(t), s(t < 0 ? 0 : 0 | d(t))
            }

            function h(t) {
                let e = t.length < 0 ? 0 : 0 | d(t.length),
                    r = s(e);
                for (let n = 0; n < e; n += 1) r[n] = 255 & t[n];
                return r
            }

            function c(t, e, r) {
                let n;
                if (e < 0 || t.byteLength < e) throw RangeError('"offset" is outside of buffer bounds');
                if (t.byteLength < e + (r || 0)) throw RangeError('"length" is outside of buffer bounds');
                return Object.setPrototypeOf(n = void 0 === e && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, e) : new Uint8Array(t, e, r), u.prototype), n
            }

            function d(t) {
                if (t >= 2147483647) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");
                return 0 | t
            }

            function p(t, e) {
                if (u.isBuffer(t)) return t.length;
                if (ArrayBuffer.isView(t) || N(t, ArrayBuffer)) return t.byteLength;
                if ("string" != typeof t) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
                let r = t.length,
                    n = arguments.length > 2 && !0 === arguments[2];
                if (!n && 0 === r) return 0;
                let i = !1;
                for (;;) switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return r;
                    case "utf8":
                    case "utf-8":
                        return U(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * r;
                    case "hex":
                        return r >>> 1;
                    case "base64":
                        return P(t).length;
                    default:
                        if (i) return n ? -1 : U(t).length;
                        e = ("" + e).toLowerCase(), i = !0
                }
            }

            function y(t, e, r) {
                let i = !1;
                if ((void 0 === e || e < 0) && (e = 0), e > this.length || ((void 0 === r || r > this.length) && (r = this.length), r <= 0 || (r >>>= 0) <= (e >>>= 0))) return "";
                for (t || (t = "utf8");;) switch (t) {
                    case "hex":
                        return function(t, e, r) {
                            let n = t.length;
                            (!e || e < 0) && (e = 0), (!r || r < 0 || r > n) && (r = n);
                            let i = "";
                            for (let n = e; n < r; ++n) i += j[t[n]];
                            return i
                        }(this, e, r);
                    case "utf8":
                    case "utf-8":
                        return w(this, e, r);
                    case "ascii":
                        return function(t, e, r) {
                            let n = "";
                            r = Math.min(t.length, r);
                            for (let i = e; i < r; ++i) n += String.fromCharCode(127 & t[i]);
                            return n
                        }(this, e, r);
                    case "latin1":
                    case "binary":
                        return function(t, e, r) {
                            let n = "";
                            r = Math.min(t.length, r);
                            for (let i = e; i < r; ++i) n += String.fromCharCode(t[i]);
                            return n
                        }(this, e, r);
                    case "base64":
                        var o, s;
                        return o = e, s = r, 0 === o && s === this.length ? n.fromByteArray(this) : n.fromByteArray(this.slice(o, s));
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return function(t, e, r) {
                            let n = t.slice(e, r),
                                i = "";
                            for (let t = 0; t < n.length - 1; t += 2) i += String.fromCharCode(n[t] + 256 * n[t + 1]);
                            return i
                        }(this, e, r);
                    default:
                        if (i) throw TypeError("Unknown encoding: " + t);
                        t = (t + "").toLowerCase(), i = !0
                }
            }

            function m(t, e, r) {
                let n = t[e];
                t[e] = t[r], t[r] = n
            }

            function g(t, e, r, n, i) {
                var o;
                if (0 === t.length) return -1;
                if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), (o = r = +r) != o && (r = i ? 0 : t.length - 1), r < 0 && (r = t.length + r), r >= t.length) {
                    if (i) return -1;
                    r = t.length - 1
                } else if (r < 0) {
                    if (!i) return -1;
                    r = 0
                }
                if ("string" == typeof e && (e = u.from(e, n)), u.isBuffer(e)) return 0 === e.length ? -1 : v(t, e, r, n, i);
                if ("number" == typeof e) return (e &= 255, "function" == typeof Uint8Array.prototype.indexOf) ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : v(t, [e], r, n, i);
                throw TypeError("val must be string, number or Buffer")
            }

            function v(t, e, r, n, i) {
                let o, s = 1,
                    u = t.length,
                    a = e.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (t.length < 2 || e.length < 2) return -1;
                    s = 2, u /= 2, a /= 2, r /= 2
                }

                function l(t, e) {
                    return 1 === s ? t[e] : t.readUInt16BE(e * s)
                }
                if (i) {
                    let n = -1;
                    for (o = r; o < u; o++)
                        if (l(t, o) === l(e, -1 === n ? 0 : o - n)) {
                            if (-1 === n && (n = o), o - n + 1 === a) return n * s
                        } else -1 !== n && (o -= o - n), n = -1
                } else
                    for (r + a > u && (r = u - a), o = r; o >= 0; o--) {
                        let r = !0;
                        for (let n = 0; n < a; n++)
                            if (l(t, o + n) !== l(e, n)) {
                                r = !1;
                                break
                            }
                        if (r) return o
                    }
                return -1
            }

            function w(t, e, r) {
                r = Math.min(t.length, r);
                let n = [],
                    i = e;
                for (; i < r;) {
                    let e = t[i],
                        o = null,
                        s = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                    if (i + s <= r) {
                        let r, n, u, a;
                        switch (s) {
                            case 1:
                                e < 128 && (o = e);
                                break;
                            case 2:
                                (192 & (r = t[i + 1])) == 128 && (a = (31 & e) << 6 | 63 & r) > 127 && (o = a);
                                break;
                            case 3:
                                r = t[i + 1], n = t[i + 2], (192 & r) == 128 && (192 & n) == 128 && (a = (15 & e) << 12 | (63 & r) << 6 | 63 & n) > 2047 && (a < 55296 || a > 57343) && (o = a);
                                break;
                            case 4:
                                r = t[i + 1], n = t[i + 2], u = t[i + 3], (192 & r) == 128 && (192 & n) == 128 && (192 & u) == 128 && (a = (15 & e) << 18 | (63 & r) << 12 | (63 & n) << 6 | 63 & u) > 65535 && a < 1114112 && (o = a)
                        }
                    }
                    null === o ? (o = 65533, s = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | 1023 & o), n.push(o), i += s
                }
                return function(t) {
                    let e = t.length;
                    if (e <= 4096) return String.fromCharCode.apply(String, t);
                    let r = "",
                        n = 0;
                    for (; n < e;) r += String.fromCharCode.apply(String, t.slice(n, n += 4096));
                    return r
                }(n)
            }

            function b(t, e, r) {
                if (t % 1 != 0 || t < 0) throw RangeError("offset is not uint");
                if (t + e > r) throw RangeError("Trying to access beyond buffer length")
            }

            function E(t, e, r, n, i, o) {
                if (!u.isBuffer(t)) throw TypeError('"buffer" argument must be a Buffer instance');
                if (e > i || e < o) throw RangeError('"value" argument is out of bounds');
                if (r + n > t.length) throw RangeError("Index out of range")
            }

            function x(t, e, r, n, i) {
                k(e, n, i, t, r, 7);
                let o = Number(e & BigInt(4294967295));
                t[r++] = o, o >>= 8, t[r++] = o, o >>= 8, t[r++] = o, o >>= 8, t[r++] = o;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[r++] = s, s >>= 8, t[r++] = s, s >>= 8, t[r++] = s, s >>= 8, t[r++] = s, r
            }

            function M(t, e, r, n, i) {
                k(e, n, i, t, r, 7);
                let o = Number(e & BigInt(4294967295));
                t[r + 7] = o, o >>= 8, t[r + 6] = o, o >>= 8, t[r + 5] = o, o >>= 8, t[r + 4] = o;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[r + 3] = s, s >>= 8, t[r + 2] = s, s >>= 8, t[r + 1] = s, s >>= 8, t[r] = s, r + 8
            }

            function _(t, e, r, n, i, o) {
                if (r + n > t.length || r < 0) throw RangeError("Index out of range")
            }

            function A(t, e, r, n, o) {
                return e = +e, r >>>= 0, o || _(t, e, r, 4, 34028234663852886e22, -34028234663852886e22), i.write(t, e, r, n, 23, 4), r + 4
            }

            function B(t, e, r, n, o) {
                return e = +e, r >>>= 0, o || _(t, e, r, 8, 17976931348623157e292, -17976931348623157e292), i.write(t, e, r, n, 52, 8), r + 8
            }
            e.Buffer = u, e.SlowBuffer = function(t) {
                return +t != t && (t = 0), u.alloc(+t)
            }, e.INSPECT_MAX_BYTES = 50, e.kMaxLength = 2147483647, u.TYPED_ARRAY_SUPPORT = function() {
                try {
                    let t = new Uint8Array(1),
                        e = {
                            foo: function() {
                                return 42
                            }
                        };
                    return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(t, e), 42 === t.foo()
                } catch (t) {
                    return !1
                }
            }(), u.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(u.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (u.isBuffer(this)) return this.buffer
                }
            }), Object.defineProperty(u.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (u.isBuffer(this)) return this.byteOffset
                }
            }), u.poolSize = 8192, u.from = function(t, e, r) {
                return a(t, e, r)
            }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array), u.alloc = function(t, e, r) {
                return (l(t), t <= 0) ? s(t) : void 0 !== e ? "string" == typeof r ? s(t).fill(e, r) : s(t).fill(e) : s(t)
            }, u.allocUnsafe = function(t) {
                return f(t)
            }, u.allocUnsafeSlow = function(t) {
                return f(t)
            }, u.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer && t !== u.prototype
            }, u.compare = function(t, e) {
                if (N(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), N(e, Uint8Array) && (e = u.from(e, e.offset, e.byteLength)), !u.isBuffer(t) || !u.isBuffer(e)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (t === e) return 0;
                let r = t.length,
                    n = e.length;
                for (let i = 0, o = Math.min(r, n); i < o; ++i)
                    if (t[i] !== e[i]) {
                        r = t[i], n = e[i];
                        break
                    }
                return r < n ? -1 : n < r ? 1 : 0
            }, u.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, u.concat = function(t, e) {
                let r;
                if (!Array.isArray(t)) throw TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length) return u.alloc(0);
                if (void 0 === e)
                    for (r = 0, e = 0; r < t.length; ++r) e += t[r].length;
                let n = u.allocUnsafe(e),
                    i = 0;
                for (r = 0; r < t.length; ++r) {
                    let e = t[r];
                    if (N(e, Uint8Array)) i + e.length > n.length ? (u.isBuffer(e) || (e = u.from(e)), e.copy(n, i)) : Uint8Array.prototype.set.call(n, e, i);
                    else if (u.isBuffer(e)) e.copy(n, i);
                    else throw TypeError('"list" argument must be an Array of Buffers');
                    i += e.length
                }
                return n
            }, u.byteLength = p, u.prototype._isBuffer = !0, u.prototype.swap16 = function() {
                let t = this.length;
                if (t % 2 != 0) throw RangeError("Buffer size must be a multiple of 16-bits");
                for (let e = 0; e < t; e += 2) m(this, e, e + 1);
                return this
            }, u.prototype.swap32 = function() {
                let t = this.length;
                if (t % 4 != 0) throw RangeError("Buffer size must be a multiple of 32-bits");
                for (let e = 0; e < t; e += 4) m(this, e, e + 3), m(this, e + 1, e + 2);
                return this
            }, u.prototype.swap64 = function() {
                let t = this.length;
                if (t % 8 != 0) throw RangeError("Buffer size must be a multiple of 64-bits");
                for (let e = 0; e < t; e += 8) m(this, e, e + 7), m(this, e + 1, e + 6), m(this, e + 2, e + 5), m(this, e + 3, e + 4);
                return this
            }, u.prototype.toString = function() {
                let t = this.length;
                return 0 === t ? "" : 0 == arguments.length ? w(this, 0, t) : y.apply(this, arguments)
            }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(t) {
                if (!u.isBuffer(t)) throw TypeError("Argument must be a Buffer");
                return this === t || 0 === u.compare(this, t)
            }, u.prototype.inspect = function() {
                let t = "",
                    r = e.INSPECT_MAX_BYTES;
                return t = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (t += " ... "), "<Buffer " + t + ">"
            }, o && (u.prototype[o] = u.prototype.inspect), u.prototype.compare = function(t, e, r, n, i) {
                if (N(t, Uint8Array) && (t = u.from(t, t.offset, t.byteLength)), !u.isBuffer(t)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
                if (void 0 === e && (e = 0), void 0 === r && (r = t ? t.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), e < 0 || r > t.length || n < 0 || i > this.length) throw RangeError("out of range index");
                if (n >= i && e >= r) return 0;
                if (n >= i) return -1;
                if (e >= r) return 1;
                if (e >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === t) return 0;
                let o = i - n,
                    s = r - e,
                    a = Math.min(o, s),
                    l = this.slice(n, i),
                    f = t.slice(e, r);
                for (let t = 0; t < a; ++t)
                    if (l[t] !== f[t]) {
                        o = l[t], s = f[t];
                        break
                    }
                return o < s ? -1 : s < o ? 1 : 0
            }, u.prototype.includes = function(t, e, r) {
                return -1 !== this.indexOf(t, e, r)
            }, u.prototype.indexOf = function(t, e, r) {
                return g(this, t, e, r, !0)
            }, u.prototype.lastIndexOf = function(t, e, r) {
                return g(this, t, e, r, !1)
            }, u.prototype.write = function(t, e, r, n) {
                var i, o, s, u, a, l, f, h;
                if (void 0 === e) n = "utf8", r = this.length, e = 0;
                else if (void 0 === r && "string" == typeof e) n = e, r = this.length, e = 0;
                else if (isFinite(e)) e >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
                else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                let c = this.length - e;
                if ((void 0 === r || r > c) && (r = c), t.length > 0 && (r < 0 || e < 0) || e > this.length) throw RangeError("Attempt to write outside buffer bounds");
                n || (n = "utf8");
                let d = !1;
                for (;;) switch (n) {
                    case "hex":
                        return function(t, e, r, n) {
                            let i;
                            r = Number(r) || 0;
                            let o = t.length - r;
                            n ? (n = Number(n)) > o && (n = o) : n = o;
                            let s = e.length;
                            for (n > s / 2 && (n = s / 2), i = 0; i < n; ++i) {
                                let n = parseInt(e.substr(2 * i, 2), 16);
                                if (n != n) break;
                                t[r + i] = n
                            }
                            return i
                        }(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                        return i = e, o = r, C(U(t, this.length - i), this, i, o);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return s = e, u = r, C(function(t) {
                            let e = [];
                            for (let r = 0; r < t.length; ++r) e.push(255 & t.charCodeAt(r));
                            return e
                        }(t), this, s, u);
                    case "base64":
                        return a = e, l = r, C(P(t), this, a, l);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return f = e, h = r, C(function(t, e) {
                            let r, n;
                            let i = [];
                            for (let o = 0; o < t.length && !((e -= 2) < 0); ++o) n = (r = t.charCodeAt(o)) >> 8, i.push(r % 256), i.push(n);
                            return i
                        }(t, this.length - f), this, f, h);
                    default:
                        if (d) throw TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(), d = !0
                }
            }, u.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }, u.prototype.slice = function(t, e) {
                let r = this.length;
                t = ~~t, e = void 0 === e ? r : ~~e, t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), e < t && (e = t);
                let n = this.subarray(t, e);
                return Object.setPrototypeOf(n, u.prototype), n
            }, u.prototype.readUintLE = u.prototype.readUIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || b(t, e, this.length);
                let n = this[t],
                    i = 1,
                    o = 0;
                for (; ++o < e && (i *= 256);) n += this[t + o] * i;
                return n
            }, u.prototype.readUintBE = u.prototype.readUIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || b(t, e, this.length);
                let n = this[t + --e],
                    i = 1;
                for (; e > 0 && (i *= 256);) n += this[t + --e] * i;
                return n
            }, u.prototype.readUint8 = u.prototype.readUInt8 = function(t, e) {
                return t >>>= 0, e || b(t, 1, this.length), this[t]
            }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0, e || b(t, 2, this.length), this[t] | this[t + 1] << 8
            }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0, e || b(t, 2, this.length), this[t] << 8 | this[t + 1]
            }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }, u.prototype.readBigUInt64LE = q(function(t) {
                L(t >>>= 0, "offset");
                let e = this[t],
                    r = this[t + 7];
                (void 0 === e || void 0 === r) && R(t, this.length - 8);
                let n = e + 256 * this[++t] + 65536 * this[++t] + 16777216 * this[++t],
                    i = this[++t] + 256 * this[++t] + 65536 * this[++t] + 16777216 * r;
                return BigInt(n) + (BigInt(i) << BigInt(32))
            }), u.prototype.readBigUInt64BE = q(function(t) {
                L(t >>>= 0, "offset");
                let e = this[t],
                    r = this[t + 7];
                (void 0 === e || void 0 === r) && R(t, this.length - 8);
                let n = 16777216 * e + 65536 * this[++t] + 256 * this[++t] + this[++t],
                    i = 16777216 * this[++t] + 65536 * this[++t] + 256 * this[++t] + r;
                return (BigInt(n) << BigInt(32)) + BigInt(i)
            }), u.prototype.readIntLE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || b(t, e, this.length);
                let n = this[t],
                    i = 1,
                    o = 0;
                for (; ++o < e && (i *= 256);) n += this[t + o] * i;
                return n >= (i *= 128) && (n -= Math.pow(2, 8 * e)), n
            }, u.prototype.readIntBE = function(t, e, r) {
                t >>>= 0, e >>>= 0, r || b(t, e, this.length);
                let n = e,
                    i = 1,
                    o = this[t + --n];
                for (; n > 0 && (i *= 256);) o += this[t + --n] * i;
                return o >= (i *= 128) && (o -= Math.pow(2, 8 * e)), o
            }, u.prototype.readInt8 = function(t, e) {
                return (t >>>= 0, e || b(t, 1, this.length), 128 & this[t]) ? -((255 - this[t] + 1) * 1) : this[t]
            }, u.prototype.readInt16LE = function(t, e) {
                t >>>= 0, e || b(t, 2, this.length);
                let r = this[t] | this[t + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, u.prototype.readInt16BE = function(t, e) {
                t >>>= 0, e || b(t, 2, this.length);
                let r = this[t + 1] | this[t] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, u.prototype.readInt32LE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }, u.prototype.readInt32BE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }, u.prototype.readBigInt64LE = q(function(t) {
                L(t >>>= 0, "offset");
                let e = this[t],
                    r = this[t + 7];
                return (void 0 === e || void 0 === r) && R(t, this.length - 8), (BigInt(this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (r << 24)) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + 16777216 * this[++t])
            }), u.prototype.readBigInt64BE = q(function(t) {
                L(t >>>= 0, "offset");
                let e = this[t],
                    r = this[t + 7];
                return (void 0 === e || void 0 === r) && R(t, this.length - 8), (BigInt((e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t]) << BigInt(32)) + BigInt(16777216 * this[++t] + 65536 * this[++t] + 256 * this[++t] + r)
            }), u.prototype.readFloatLE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), i.read(this, t, !0, 23, 4)
            }, u.prototype.readFloatBE = function(t, e) {
                return t >>>= 0, e || b(t, 4, this.length), i.read(this, t, !1, 23, 4)
            }, u.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0, e || b(t, 8, this.length), i.read(this, t, !0, 52, 8)
            }, u.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0, e || b(t, 8, this.length), i.read(this, t, !1, 52, 8)
            }, u.prototype.writeUintLE = u.prototype.writeUIntLE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, r >>>= 0, !n) {
                    let n = Math.pow(2, 8 * r) - 1;
                    E(this, t, e, r, n, 0)
                }
                let i = 1,
                    o = 0;
                for (this[e] = 255 & t; ++o < r && (i *= 256);) this[e + o] = t / i & 255;
                return e + r
            }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, r >>>= 0, !n) {
                    let n = Math.pow(2, 8 * r) - 1;
                    E(this, t, e, r, n, 0)
                }
                let i = r - 1,
                    o = 1;
                for (this[e + i] = 255 & t; --i >= 0 && (o *= 256);) this[e + i] = t / o & 255;
                return e + r
            }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 1, 255, 0), this[e] = 255 & t, e + 1
            }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 2, 65535, 0), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 2, 65535, 0), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 4, 4294967295, 0), this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t, e + 4
            }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 4, 4294967295, 0), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, u.prototype.writeBigUInt64LE = q(function(t, e = 0) {
                return x(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }), u.prototype.writeBigUInt64BE = q(function(t, e = 0) {
                return M(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }), u.prototype.writeIntLE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, !n) {
                    let n = Math.pow(2, 8 * r - 1);
                    E(this, t, e, r, n - 1, -n)
                }
                let i = 0,
                    o = 1,
                    s = 0;
                for (this[e] = 255 & t; ++i < r && (o *= 256);) t < 0 && 0 === s && 0 !== this[e + i - 1] && (s = 1), this[e + i] = (t / o >> 0) - s & 255;
                return e + r
            }, u.prototype.writeIntBE = function(t, e, r, n) {
                if (t = +t, e >>>= 0, !n) {
                    let n = Math.pow(2, 8 * r - 1);
                    E(this, t, e, r, n - 1, -n)
                }
                let i = r - 1,
                    o = 1,
                    s = 0;
                for (this[e + i] = 255 & t; --i >= 0 && (o *= 256);) t < 0 && 0 === s && 0 !== this[e + i + 1] && (s = 1), this[e + i] = (t / o >> 0) - s & 255;
                return e + r
            }, u.prototype.writeInt8 = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 1, 127, -128), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1
            }, u.prototype.writeInt16LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 2, 32767, -32768), this[e] = 255 & t, this[e + 1] = t >>> 8, e + 2
            }, u.prototype.writeInt16BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 2, 32767, -32768), this[e] = t >>> 8, this[e + 1] = 255 & t, e + 2
            }, u.prototype.writeInt32LE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 4, 2147483647, -2147483648), this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24, e + 4
            }, u.prototype.writeInt32BE = function(t, e, r) {
                return t = +t, e >>>= 0, r || E(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t, e + 4
            }, u.prototype.writeBigInt64LE = q(function(t, e = 0) {
                return x(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }), u.prototype.writeBigInt64BE = q(function(t, e = 0) {
                return M(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }), u.prototype.writeFloatLE = function(t, e, r) {
                return A(this, t, e, !0, r)
            }, u.prototype.writeFloatBE = function(t, e, r) {
                return A(this, t, e, !1, r)
            }, u.prototype.writeDoubleLE = function(t, e, r) {
                return B(this, t, e, !0, r)
            }, u.prototype.writeDoubleBE = function(t, e, r) {
                return B(this, t, e, !1, r)
            }, u.prototype.copy = function(t, e, r, n) {
                if (!u.isBuffer(t)) throw TypeError("argument should be a Buffer");
                if (r || (r = 0), n || 0 === n || (n = this.length), e >= t.length && (e = t.length), e || (e = 0), n > 0 && n < r && (n = r), n === r || 0 === t.length || 0 === this.length) return 0;
                if (e < 0) throw RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw RangeError("Index out of range");
                if (n < 0) throw RangeError("sourceEnd out of bounds");
                n > this.length && (n = this.length), t.length - e < n - r && (n = t.length - e + r);
                let i = n - r;
                return this === t && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, r, n) : Uint8Array.prototype.set.call(t, this.subarray(r, n), e), i
            }, u.prototype.fill = function(t, e, r, n) {
                let i;
                if ("string" == typeof t) {
                    if ("string" == typeof e ? (n = e, e = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw TypeError("encoding must be a string");
                    if ("string" == typeof n && !u.isEncoding(n)) throw TypeError("Unknown encoding: " + n);
                    if (1 === t.length) {
                        let e = t.charCodeAt(0);
                        ("utf8" === n && e < 128 || "latin1" === n) && (t = e)
                    }
                } else "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t));
                if (e < 0 || this.length < e || this.length < r) throw RangeError("Out of range index");
                if (r <= e) return this;
                if (e >>>= 0, r = void 0 === r ? this.length : r >>> 0, t || (t = 0), "number" == typeof t)
                    for (i = e; i < r; ++i) this[i] = t;
                else {
                    let o = u.isBuffer(t) ? t : u.from(t, n),
                        s = o.length;
                    if (0 === s) throw TypeError('The value "' + t + '" is invalid for argument "value"');
                    for (i = 0; i < r - e; ++i) this[i + e] = o[i % s]
                }
                return this
            };
            let S = {};

            function O(t, e, r) {
                S[t] = class extends r {
                    constructor() {
                        super(), Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }), this.name = `${this.name} [${t}]`, this.stack, delete this.name
                    }
                    get code() {
                        return t
                    }
                    set code(t) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: t,
                            writable: !0
                        })
                    }
                    toString() {
                        return `${this.name} [${t}]: ${this.message}`
                    }
                }
            }

            function I(t) {
                let e = "",
                    r = t.length,
                    n = "-" === t[0] ? 1 : 0;
                for (; r >= n + 4; r -= 3) e = `_${t.slice(r-3,r)}${e}`;
                return `${t.slice(0,r)}${e}`
            }

            function k(t, e, r, n, i, o) {
                if (t > r || t < e) {
                    let n;
                    let i = "bigint" == typeof e ? "n" : "";
                    throw n = o > 3 ? 0 === e || e === BigInt(0) ? `>= 0${i} and < 2${i} ** ${(o+1)*8}${i}` : `>= -(2${i} ** ${(o+1)*8-1}${i}) and < 2 ** ${(o+1)*8-1}${i}` : `>= ${e}${i} and <= ${r}${i}`, new S.ERR_OUT_OF_RANGE("value", n, t)
                }
                L(i, "offset"), (void 0 === n[i] || void 0 === n[i + o]) && R(i, n.length - (o + 1))
            }

            function L(t, e) {
                if ("number" != typeof t) throw new S.ERR_INVALID_ARG_TYPE(e, "number", t)
            }

            function R(t, e, r) {
                if (Math.floor(t) !== t) throw L(t, r), new S.ERR_OUT_OF_RANGE(r || "offset", "an integer", t);
                if (e < 0) throw new S.ERR_BUFFER_OUT_OF_BOUNDS;
                throw new S.ERR_OUT_OF_RANGE(r || "offset", `>= ${r?1:0} and <= ${e}`, t)
            }
            O("ERR_BUFFER_OUT_OF_BOUNDS", function(t) {
                return t ? `${t} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
            }, RangeError), O("ERR_INVALID_ARG_TYPE", function(t, e) {
                return `The "${t}" argument must be of type number. Received type ${typeof e}`
            }, TypeError), O("ERR_OUT_OF_RANGE", function(t, e, r) {
                let n = `The value of "${t}" is out of range.`,
                    i = r;
                return Number.isInteger(r) && Math.abs(r) > 4294967296 ? i = I(String(r)) : "bigint" == typeof r && (i = String(r), (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) && (i = I(i)), i += "n"), n += ` It must be ${e}. Received ${i}`
            }, RangeError);
            let T = /[^+/0-9A-Za-z-_]/g;

            function U(t, e) {
                let r;
                e = e || 1 / 0;
                let n = t.length,
                    i = null,
                    o = [];
                for (let s = 0; s < n; ++s) {
                    if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
                        if (!i) {
                            if (r > 56319 || s + 1 === n) {
                                (e -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            i = r;
                            continue
                        }
                        if (r < 56320) {
                            (e -= 3) > -1 && o.push(239, 191, 189), i = r;
                            continue
                        }
                        r = (i - 55296 << 10 | r - 56320) + 65536
                    } else i && (e -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null, r < 128) {
                        if ((e -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((e -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((e -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else if (r < 1114112) {
                        if ((e -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    } else throw Error("Invalid code point")
                }
                return o
            }

            function P(t) {
                return n.toByteArray(function(t) {
                    if ((t = (t = t.split("=")[0]).trim().replace(T, "")).length < 2) return "";
                    for (; t.length % 4 != 0;) t += "=";
                    return t
                }(t))
            }

            function C(t, e, r, n) {
                let i;
                for (i = 0; i < n && !(i + r >= e.length) && !(i >= t.length); ++i) e[i + r] = t[i];
                return i
            }

            function N(t, e) {
                return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
            }
            let j = function() {
                let t = "0123456789abcdef",
                    e = Array(256);
                for (let r = 0; r < 16; ++r) {
                    let n = 16 * r;
                    for (let i = 0; i < 16; ++i) e[n + i] = t[r] + t[i]
                }
                return e
            }();

            function q(t) {
                return "undefined" == typeof BigInt ? F : t
            }

            function F() {
                throw Error("BigInt not supported")
            }
        },
        2614: function(t) {
            "use strict";
            var e = Object.prototype.hasOwnProperty,
                r = "~";

            function n() {}

            function i(t, e, r) {
                this.fn = t, this.context = e, this.once = r || !1
            }

            function o(t, e, n, o, s) {
                if ("function" != typeof n) throw TypeError("The listener must be a function");
                var u = new i(n, o || t, s),
                    a = r ? r + e : e;
                return t._events[a] ? t._events[a].fn ? t._events[a] = [t._events[a], u] : t._events[a].push(u) : (t._events[a] = u, t._eventsCount++), t
            }

            function s(t, e) {
                0 == --t._eventsCount ? t._events = new n : delete t._events[e]
            }

            function u() {
                this._events = new n, this._eventsCount = 0
            }
            Object.create && (n.prototype = Object.create(null), new n().__proto__ || (r = !1)), u.prototype.eventNames = function() {
                var t, n, i = [];
                if (0 === this._eventsCount) return i;
                for (n in t = this._events) e.call(t, n) && i.push(r ? n.slice(1) : n);
                return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(t)) : i
            }, u.prototype.listeners = function(t) {
                var e = r ? r + t : t,
                    n = this._events[e];
                if (!n) return [];
                if (n.fn) return [n.fn];
                for (var i = 0, o = n.length, s = Array(o); i < o; i++) s[i] = n[i].fn;
                return s
            }, u.prototype.listenerCount = function(t) {
                var e = r ? r + t : t,
                    n = this._events[e];
                return n ? n.fn ? 1 : n.length : 0
            }, u.prototype.emit = function(t, e, n, i, o, s) {
                var u = r ? r + t : t;
                if (!this._events[u]) return !1;
                var a, l, f = this._events[u],
                    h = arguments.length;
                if (f.fn) {
                    switch (f.once && this.removeListener(t, f.fn, void 0, !0), h) {
                        case 1:
                            return f.fn.call(f.context), !0;
                        case 2:
                            return f.fn.call(f.context, e), !0;
                        case 3:
                            return f.fn.call(f.context, e, n), !0;
                        case 4:
                            return f.fn.call(f.context, e, n, i), !0;
                        case 5:
                            return f.fn.call(f.context, e, n, i, o), !0;
                        case 6:
                            return f.fn.call(f.context, e, n, i, o, s), !0
                    }
                    for (l = 1, a = Array(h - 1); l < h; l++) a[l - 1] = arguments[l];
                    f.fn.apply(f.context, a)
                } else {
                    var c, d = f.length;
                    for (l = 0; l < d; l++) switch (f[l].once && this.removeListener(t, f[l].fn, void 0, !0), h) {
                        case 1:
                            f[l].fn.call(f[l].context);
                            break;
                        case 2:
                            f[l].fn.call(f[l].context, e);
                            break;
                        case 3:
                            f[l].fn.call(f[l].context, e, n);
                            break;
                        case 4:
                            f[l].fn.call(f[l].context, e, n, i);
                            break;
                        default:
                            if (!a)
                                for (c = 1, a = Array(h - 1); c < h; c++) a[c - 1] = arguments[c];
                            f[l].fn.apply(f[l].context, a)
                    }
                }
                return !0
            }, u.prototype.on = function(t, e, r) {
                return o(this, t, e, r, !1)
            }, u.prototype.once = function(t, e, r) {
                return o(this, t, e, r, !0)
            }, u.prototype.removeListener = function(t, e, n, i) {
                var o = r ? r + t : t;
                if (!this._events[o]) return this;
                if (!e) return s(this, o), this;
                var u = this._events[o];
                if (u.fn) u.fn !== e || i && !u.once || n && u.context !== n || s(this, o);
                else {
                    for (var a = 0, l = [], f = u.length; a < f; a++)(u[a].fn !== e || i && !u[a].once || n && u[a].context !== n) && l.push(u[a]);
                    l.length ? this._events[o] = 1 === l.length ? l[0] : l : s(this, o)
                }
                return this
            }, u.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = r ? r + t : t, this._events[e] && s(this, e)) : (this._events = new n, this._eventsCount = 0), this
            }, u.prototype.off = u.prototype.removeListener, u.prototype.addListener = u.prototype.on, u.prefixed = r, u.EventEmitter = u, t.exports = u
        },
        1531: function(t, e) { /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
            e.read = function(t, e, r, n, i) {
                var o, s, u = 8 * i - n - 1,
                    a = (1 << u) - 1,
                    l = a >> 1,
                    f = -7,
                    h = r ? i - 1 : 0,
                    c = r ? -1 : 1,
                    d = t[e + h];
                for (h += c, o = d & (1 << -f) - 1, d >>= -f, f += u; f > 0; o = 256 * o + t[e + h], h += c, f -= 8);
                for (s = o & (1 << -f) - 1, o >>= -f, f += n; f > 0; s = 256 * s + t[e + h], h += c, f -= 8);
                if (0 === o) o = 1 - l;
                else {
                    if (o === a) return s ? NaN : 1 / 0 * (d ? -1 : 1);
                    s += Math.pow(2, n), o -= l
                }
                return (d ? -1 : 1) * s * Math.pow(2, o - n)
            }, e.write = function(t, e, r, n, i, o) {
                var s, u, a, l = 8 * o - i - 1,
                    f = (1 << l) - 1,
                    h = f >> 1,
                    c = 23 === i ? 5960464477539062e-23 : 0,
                    d = n ? 0 : o - 1,
                    p = n ? 1 : -1,
                    y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                for (isNaN(e = Math.abs(e)) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, s = f) : (s = Math.floor(Math.log(e) / Math.LN2), e * (a = Math.pow(2, -s)) < 1 && (s--, a *= 2), s + h >= 1 ? e += c / a : e += c * Math.pow(2, 1 - h), e * a >= 2 && (s++, a /= 2), s + h >= f ? (u = 0, s = f) : s + h >= 1 ? (u = (e * a - 1) * Math.pow(2, i), s += h) : (u = e * Math.pow(2, h - 1) * Math.pow(2, i), s = 0)); i >= 8; t[r + d] = 255 & u, d += p, u /= 256, i -= 8);
                for (s = s << i | u, l += i; l > 0; t[r + d] = 255 & s, d += p, s /= 256, l -= 8);
                t[r + d - p] |= 128 * y
            }
        },
        4967: function(t, e, r) {
            "use strict";
            let n = r(7932).v4,
                i = r(1856),
                o = function(t, e) {
                    if (!(this instanceof o)) return new o(t, e);
                    e || (e = {}), this.options = {
                        reviver: void 0 !== e.reviver ? e.reviver : null,
                        replacer: void 0 !== e.replacer ? e.replacer : null,
                        generator: void 0 !== e.generator ? e.generator : function() {
                            return n()
                        },
                        version: void 0 !== e.version ? e.version : 2,
                        notificationIdNull: "boolean" == typeof e.notificationIdNull && e.notificationIdNull
                    }, this.callServer = t
                };
            t.exports = o, o.prototype.request = function(t, e, r, n) {
                let o;
                let s = this,
                    u = null,
                    a = Array.isArray(t) && "function" == typeof e;
                if (1 === this.options.version && a) throw TypeError("JSON-RPC 1.0 does not support batching");
                let l = !a && t && "object" == typeof t && "function" == typeof e;
                if (a || l) n = e, u = t;
                else {
                    "function" == typeof r && (n = r, r = void 0);
                    let o = "function" == typeof n;
                    try {
                        u = i(t, e, r, {
                            generator: this.options.generator,
                            version: this.options.version,
                            notificationIdNull: this.options.notificationIdNull
                        })
                    } catch (t) {
                        if (o) return n(t);
                        throw t
                    }
                    if (!o) return u
                }
                try {
                    o = JSON.stringify(u, this.options.replacer)
                } catch (t) {
                    return n(t)
                }
                return this.callServer(o, function(t, e) {
                    s._parseResponse(t, e, n)
                }), u
            }, o.prototype._parseResponse = function(t, e, r) {
                let n;
                if (t) {
                    r(t);
                    return
                }
                if (!e) return r();
                try {
                    n = JSON.parse(e, this.options.reviver)
                } catch (t) {
                    return r(t)
                }
                if (3 === r.length) {
                    if (!Array.isArray(n)) return r(null, n.error, n.result); {
                        let t = function(t) {
                            return void 0 !== t.error
                        };
                        return r(null, n.filter(t), n.filter(function(e) {
                            return !t(e)
                        }))
                    }
                }
                r(null, n)
            }
        },
        1856: function(t, e, r) {
            "use strict";
            let n = r(7932).v4;
            t.exports = function(t, e, r, i) {
                if ("string" != typeof t) throw TypeError(t + " must be a string");
                let o = "number" == typeof(i = i || {}).version ? i.version : 2;
                if (1 !== o && 2 !== o) throw TypeError(o + " must be 1 or 2");
                let s = {
                    method: t
                };
                if (2 === o && (s.jsonrpc = "2.0"), e) {
                    if ("object" != typeof e && !Array.isArray(e)) throw TypeError(e + " must be an object, array or omitted");
                    s.params = e
                }
                if (void 0 === r) {
                    let t = "function" == typeof i.generator ? i.generator : function() {
                        return n()
                    };
                    s.id = t(s, i)
                } else 2 === o && null === r ? i.notificationIdNull && (s.id = null) : s.id = r;
                return s
            }
        },
        4232: function(t, e, r) {
            "use strict";
            r.d(e, {
                default: function() {
                    return i.a
                }
            });
            var n = r(4930),
                i = r.n(n)
        },
        9079: function(t, e, r) {
            "use strict";
            var n, i;
            t.exports = (null == (n = r.g.process) ? void 0 : n.env) && "object" == typeof(null == (i = r.g.process) ? void 0 : i.env) ? r.g.process : r(3127)
        },
        3127: function(t) {
            ! function() {
                var e = {
                        229: function(t) {
                            var e, r, n, i = t.exports = {};

                            function o() {
                                throw Error("setTimeout has not been defined")
                            }

                            function s() {
                                throw Error("clearTimeout has not been defined")
                            }

                            function u(t) {
                                if (e === setTimeout) return setTimeout(t, 0);
                                if ((e === o || !e) && setTimeout) return e = setTimeout, setTimeout(t, 0);
                                try {
                                    return e(t, 0)
                                } catch (r) {
                                    try {
                                        return e.call(null, t, 0)
                                    } catch (r) {
                                        return e.call(this, t, 0)
                                    }
                                }
                            }! function() {
                                try {
                                    e = "function" == typeof setTimeout ? setTimeout : o
                                } catch (t) {
                                    e = o
                                }
                                try {
                                    r = "function" == typeof clearTimeout ? clearTimeout : s
                                } catch (t) {
                                    r = s
                                }
                            }();
                            var a = [],
                                l = !1,
                                f = -1;

                            function h() {
                                l && n && (l = !1, n.length ? a = n.concat(a) : f = -1, a.length && c())
                            }

                            function c() {
                                if (!l) {
                                    var t = u(h);
                                    l = !0;
                                    for (var e = a.length; e;) {
                                        for (n = a, a = []; ++f < e;) n && n[f].run();
                                        f = -1, e = a.length
                                    }
                                    n = null, l = !1,
                                        function(t) {
                                            if (r === clearTimeout) return clearTimeout(t);
                                            if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(t);
                                            try {
                                                r(t)
                                            } catch (e) {
                                                try {
                                                    return r.call(null, t)
                                                } catch (e) {
                                                    return r.call(this, t)
                                                }
                                            }
                                        }(t)
                                }
                            }

                            function d(t, e) {
                                this.fun = t, this.array = e
                            }

                            function p() {}
                            i.nextTick = function(t) {
                                var e = Array(arguments.length - 1);
                                if (arguments.length > 1)
                                    for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
                                a.push(new d(t, e)), 1 !== a.length || l || u(c)
                            }, d.prototype.run = function() {
                                this.fun.apply(null, this.array)
                            }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = p, i.addListener = p, i.once = p, i.off = p, i.removeListener = p, i.removeAllListeners = p, i.emit = p, i.prependListener = p, i.prependOnceListener = p, i.listeners = function(t) {
                                return []
                            }, i.binding = function(t) {
                                throw Error("process.binding is not supported")
                            }, i.cwd = function() {
                                return "/"
                            }, i.chdir = function(t) {
                                throw Error("process.chdir is not supported")
                            }, i.umask = function() {
                                return 0
                            }
                        }
                    },
                    r = {};

                function n(t) {
                    var i = r[t];
                    if (void 0 !== i) return i.exports;
                    var o = r[t] = {
                            exports: {}
                        },
                        s = !0;
                    try {
                        e[t](o, o.exports, n), s = !1
                    } finally {
                        s && delete r[t]
                    }
                    return o.exports
                }
                n.ab = "//";
                var i = n(229);
                t.exports = i
            }()
        },
        4930: function(t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), Object.defineProperty(e, "default", {
                enumerable: !0,
                get: function() {
                    return o
                }
            });
            let n = r(6921);
            r(7437), r(2265);
            let i = n._(r(4795));

            function o(t, e) {
                let r = {
                    loading: t => {
                        let {
                            error: e,
                            isLoading: r,
                            pastDelay: n
                        } = t;
                        return null
                    }
                };
                return "function" == typeof t && (r.loader = t), (0, i.default)({ ...r,
                    ...e
                })
            }("function" == typeof e.default || "object" == typeof e.default && null !== e.default) && void 0 === e.default.__esModule && (Object.defineProperty(e.default, "__esModule", {
                value: !0
            }), Object.assign(e.default, e), t.exports = e.default)
        },
        9721: function(t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), Object.defineProperty(e, "BailoutToCSR", {
                enumerable: !0,
                get: function() {
                    return i
                }
            });
            let n = r(9775);

            function i(t) {
                let {
                    reason: e,
                    children: r
                } = t;
                if ("undefined" == typeof window) throw new n.BailoutToCSRError(e);
                return r
            }
        },
        4795: function(t, e, r) {
            "use strict";
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), Object.defineProperty(e, "default", {
                enumerable: !0,
                get: function() {
                    return a
                }
            });
            let n = r(7437),
                i = r(2265),
                o = r(9721);

            function s(t) {
                var e;
                return {
                    default: null != (e = null == t ? void 0 : t.default) ? e : t
                }
            }
            let u = {
                    loader: () => Promise.resolve(s(() => null)),
                    loading: null,
                    ssr: !0
                },
                a = function(t) {
                    let e = { ...u,
                            ...t
                        },
                        r = (0, i.lazy)(() => e.loader().then(s)),
                        a = e.loading;

                    function l(t) {
                        let s = a ? (0, n.jsx)(a, {
                                isLoading: !0,
                                pastDelay: !0,
                                error: null
                            }) : null,
                            u = e.ssr ? (0, n.jsx)(r, { ...t
                            }) : (0, n.jsx)(o.BailoutToCSR, {
                                reason: "next/dynamic",
                                children: (0, n.jsx)(r, { ...t
                                })
                            });
                        return (0, n.jsx)(i.Suspense, {
                            fallback: s,
                            children: u
                        })
                    }
                    return l.displayName = "LoadableComponent", l
                }
        },
        9720: function(t) {
            var e = "undefined" != typeof Element,
                r = "function" == typeof Map,
                n = "function" == typeof Set,
                i = "function" == typeof ArrayBuffer && !!ArrayBuffer.isView;
            t.exports = function(t, o) {
                try {
                    return function t(o, s) {
                        if (o === s) return !0;
                        if (o && s && "object" == typeof o && "object" == typeof s) {
                            var u, a, l, f;
                            if (o.constructor !== s.constructor) return !1;
                            if (Array.isArray(o)) {
                                if ((u = o.length) != s.length) return !1;
                                for (a = u; 0 != a--;)
                                    if (!t(o[a], s[a])) return !1;
                                return !0
                            }
                            if (r && o instanceof Map && s instanceof Map) {
                                if (o.size !== s.size) return !1;
                                for (f = o.entries(); !(a = f.next()).done;)
                                    if (!s.has(a.value[0])) return !1;
                                for (f = o.entries(); !(a = f.next()).done;)
                                    if (!t(a.value[1], s.get(a.value[0]))) return !1;
                                return !0
                            }
                            if (n && o instanceof Set && s instanceof Set) {
                                if (o.size !== s.size) return !1;
                                for (f = o.entries(); !(a = f.next()).done;)
                                    if (!s.has(a.value[0])) return !1;
                                return !0
                            }
                            if (i && ArrayBuffer.isView(o) && ArrayBuffer.isView(s)) {
                                if ((u = o.length) != s.length) return !1;
                                for (a = u; 0 != a--;)
                                    if (o[a] !== s[a]) return !1;
                                return !0
                            }
                            if (o.constructor === RegExp) return o.source === s.source && o.flags === s.flags;
                            if (o.valueOf !== Object.prototype.valueOf && "function" == typeof o.valueOf && "function" == typeof s.valueOf) return o.valueOf() === s.valueOf();
                            if (o.toString !== Object.prototype.toString && "function" == typeof o.toString && "function" == typeof s.toString) return o.toString() === s.toString();
                            if ((u = (l = Object.keys(o)).length) !== Object.keys(s).length) return !1;
                            for (a = u; 0 != a--;)
                                if (!Object.prototype.hasOwnProperty.call(s, l[a])) return !1;
                            if (e && o instanceof Element) return !1;
                            for (a = u; 0 != a--;)
                                if (("_owner" !== l[a] && "__v" !== l[a] && "__o" !== l[a] || !o.$$typeof) && !t(o[l[a]], s[l[a]])) return !1;
                            return !0
                        }
                        return o != o && s != s
                    }(t, o)
                } catch (t) {
                    if ((t.message || "").match(/stack|recursion/i)) return console.warn("react-fast-compare cannot handle circular refs"), !1;
                    throw t
                }
            }
        },
        1296: function(t, e, r) {
            "use strict";
            var n = r(3663).Buffer,
                i = r(891);
            e.Z = void 0;
            var o = i(r(8311)),
                s = i(r(580)),
                u = i(r(7564)),
                a = i(r(1816)),
                l = i(r(7472)),
                f = i(r(3810)),
                h = i(r(2242)),
                c = i(r(7898)),
                d = r(2614),
                p = r(4633),
                y = function(t, e) {
                    var r = {};
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && 0 > e.indexOf(n) && (r[n] = t[n]);
                    if (null != t && "function" == typeof Object.getOwnPropertySymbols)
                        for (var i = 0, n = Object.getOwnPropertySymbols(t); i < n.length; i++) 0 > e.indexOf(n[i]) && Object.prototype.propertyIsEnumerable.call(t, n[i]) && (r[n[i]] = t[n[i]]);
                    return r
                },
                m = function(t) {
                    (0, f.default)(v, t);
                    var e, r, i, d, m, g = (e = function() {
                        if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                        } catch (t) {
                            return !1
                        }
                    }(), function() {
                        var t, r = (0, c.default)(v);
                        if (e) {
                            var n = (0, c.default)(this).constructor;
                            t = Reflect.construct(r, arguments, n)
                        } else t = r.apply(this, arguments);
                        return (0, h.default)(this, t)
                    });

                    function v(t) {
                        var e, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "ws://localhost:8080",
                            n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                            i = arguments.length > 3 ? arguments[3] : void 0,
                            o = arguments.length > 4 ? arguments[4] : void 0;
                        (0, a.default)(this, v);
                        var s = n.autoconnect,
                            u = n.reconnect,
                            l = n.reconnect_interval,
                            f = n.max_reconnects,
                            h = y(n, ["autoconnect", "reconnect", "reconnect_interval", "max_reconnects"]);
                        return (e = g.call(this)).webSocketFactory = t, e.queue = {}, e.rpc_id = 0, e.address = r, e.autoconnect = void 0 === s || s, e.ready = !1, e.reconnect = void 0 === u || u, e.reconnect_timer_id = void 0, e.reconnect_interval = void 0 === l ? 1e3 : l, e.max_reconnects = void 0 === f ? 5 : f, e.rest_options = h, e.current_reconnects = 0, e.generate_request_id = i || function() {
                            return ++e.rpc_id
                        }, o ? e.dataPack = o : e.dataPack = new p.DefaultDataPack, e.autoconnect && e._connect(e.address, Object.assign({
                            autoconnect: e.autoconnect,
                            reconnect: e.reconnect,
                            reconnect_interval: e.reconnect_interval,
                            max_reconnects: e.max_reconnects
                        }, e.rest_options)), e
                    }
                    return (0, l.default)(v, [{
                        key: "connect",
                        value: function() {
                            this.socket || this._connect(this.address, Object.assign({
                                autoconnect: this.autoconnect,
                                reconnect: this.reconnect,
                                reconnect_interval: this.reconnect_interval,
                                max_reconnects: this.max_reconnects
                            }, this.rest_options))
                        }
                    }, {
                        key: "call",
                        value: function(t, e, r, n) {
                            var i = this;
                            return n || "object" !== (0, u.default)(r) || (n = r, r = null), new Promise(function(o, s) {
                                if (!i.ready) return s(Error("socket not ready"));
                                var u = i.generate_request_id(t, e);
                                i.socket.send(i.dataPack.encode({
                                    jsonrpc: "2.0",
                                    method: t,
                                    params: e || void 0,
                                    id: u
                                }), n, function(t) {
                                    if (t) return s(t);
                                    i.queue[u] = {
                                        promise: [o, s]
                                    }, r && (i.queue[u].timeout = setTimeout(function() {
                                        delete i.queue[u], s(Error("reply timeout"))
                                    }, r))
                                })
                            })
                        }
                    }, {
                        key: "login",
                        value: (r = (0, s.default)(o.default.mark(function t(e) {
                            var r;
                            return o.default.wrap(function(t) {
                                for (;;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.next = 2, this.call("rpc.login", e);
                                    case 2:
                                        if (r = t.sent) {
                                            t.next = 5;
                                            break
                                        }
                                        throw Error("authentication failed");
                                    case 5:
                                        return t.abrupt("return", r);
                                    case 6:
                                    case "end":
                                        return t.stop()
                                }
                            }, t, this)
                        })), function(t) {
                            return r.apply(this, arguments)
                        })
                    }, {
                        key: "listMethods",
                        value: (i = (0, s.default)(o.default.mark(function t() {
                            return o.default.wrap(function(t) {
                                for (;;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.next = 2, this.call("__listMethods");
                                    case 2:
                                        return t.abrupt("return", t.sent);
                                    case 3:
                                    case "end":
                                        return t.stop()
                                }
                            }, t, this)
                        })), function() {
                            return i.apply(this, arguments)
                        })
                    }, {
                        key: "notify",
                        value: function(t, e) {
                            var r = this;
                            return new Promise(function(n, i) {
                                if (!r.ready) return i(Error("socket not ready"));
                                r.socket.send(r.dataPack.encode({
                                    jsonrpc: "2.0",
                                    method: t,
                                    params: e
                                }), function(t) {
                                    if (t) return i(t);
                                    n()
                                })
                            })
                        }
                    }, {
                        key: "subscribe",
                        value: (d = (0, s.default)(o.default.mark(function t(e) {
                            var r;
                            return o.default.wrap(function(t) {
                                for (;;) switch (t.prev = t.next) {
                                    case 0:
                                        return "string" == typeof e && (e = [e]), t.next = 3, this.call("rpc.on", e);
                                    case 3:
                                        if (r = t.sent, !("string" == typeof e && "ok" !== r[e])) {
                                            t.next = 6;
                                            break
                                        }
                                        throw Error("Failed subscribing to an event '" + e + "' with: " + r[e]);
                                    case 6:
                                        return t.abrupt("return", r);
                                    case 7:
                                    case "end":
                                        return t.stop()
                                }
                            }, t, this)
                        })), function(t) {
                            return d.apply(this, arguments)
                        })
                    }, {
                        key: "unsubscribe",
                        value: (m = (0, s.default)(o.default.mark(function t(e) {
                            var r;
                            return o.default.wrap(function(t) {
                                for (;;) switch (t.prev = t.next) {
                                    case 0:
                                        return "string" == typeof e && (e = [e]), t.next = 3, this.call("rpc.off", e);
                                    case 3:
                                        if (r = t.sent, !("string" == typeof e && "ok" !== r[e])) {
                                            t.next = 6;
                                            break
                                        }
                                        throw Error("Failed unsubscribing from an event with: " + r);
                                    case 6:
                                        return t.abrupt("return", r);
                                    case 7:
                                    case "end":
                                        return t.stop()
                                }
                            }, t, this)
                        })), function(t) {
                            return m.apply(this, arguments)
                        })
                    }, {
                        key: "close",
                        value: function(t, e) {
                            this.socket.close(t || 1e3, e)
                        }
                    }, {
                        key: "_connect",
                        value: function(t, e) {
                            var r = this;
                            clearTimeout(this.reconnect_timer_id), this.socket = this.webSocketFactory(t, e), this.socket.addEventListener("open", function() {
                                r.ready = !0, r.emit("open"), r.current_reconnects = 0
                            }), this.socket.addEventListener("message", function(t) {
                                var e = t.data;
                                e instanceof ArrayBuffer && (e = n.from(e).toString());
                                try {
                                    e = r.dataPack.decode(e)
                                } catch (t) {
                                    return
                                }
                                if (e.notification && r.listeners(e.notification).length) {
                                    if (!Object.keys(e.params).length) return r.emit(e.notification);
                                    var i = [e.notification];
                                    if (e.params.constructor === Object) i.push(e.params);
                                    else
                                        for (var o = 0; o < e.params.length; o++) i.push(e.params[o]);
                                    return Promise.resolve().then(function() {
                                        r.emit.apply(r, i)
                                    })
                                }
                                if (!r.queue[e.id]) return e.method ? Promise.resolve().then(function() {
                                    r.emit(e.method, null == e ? void 0 : e.params)
                                }) : void 0;
                                "error" in e == "result" in e && r.queue[e.id].promise[1](Error('Server response malformed. Response must include either "result" or "error", but not both.')), r.queue[e.id].timeout && clearTimeout(r.queue[e.id].timeout), e.error ? r.queue[e.id].promise[1](e.error) : r.queue[e.id].promise[0](e.result), delete r.queue[e.id]
                            }), this.socket.addEventListener("error", function(t) {
                                return r.emit("error", t)
                            }), this.socket.addEventListener("close", function(n) {
                                var i = n.code,
                                    o = n.reason;
                                r.ready && setTimeout(function() {
                                    return r.emit("close", i, o)
                                }, 0), r.ready = !1, r.socket = void 0, 1e3 !== i && (r.current_reconnects++, r.reconnect && (r.max_reconnects > r.current_reconnects || 0 === r.max_reconnects) && (r.reconnect_timer_id = setTimeout(function() {
                                    return r._connect(t, e)
                                }, r.reconnect_interval)))
                            })
                        }
                    }]), v
                }(d.EventEmitter);
            e.Z = m
        },
        6561: function(t, e, r) {
            "use strict";
            var n = r(891);
            e.Z = function(t, e) {
                return new l(t, e)
            };
            var i = n(r(1816)),
                o = n(r(7472)),
                s = n(r(3810)),
                u = n(r(2242)),
                a = n(r(7898)),
                l = function(t) {
                    (0, s.default)(n, t);
                    var e, r = (e = function() {
                        if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                        } catch (t) {
                            return !1
                        }
                    }(), function() {
                        var t, r = (0, a.default)(n);
                        if (e) {
                            var i = (0, a.default)(this).constructor;
                            t = Reflect.construct(r, arguments, i)
                        } else t = r.apply(this, arguments);
                        return (0, u.default)(this, t)
                    });

                    function n(t, e, o) {
                        var s;
                        return (0, i.default)(this, n), (s = r.call(this)).socket = new window.WebSocket(t, o), s.socket.onopen = function() {
                            return s.emit("open")
                        }, s.socket.onmessage = function(t) {
                            return s.emit("message", t.data)
                        }, s.socket.onerror = function(t) {
                            return s.emit("error", t)
                        }, s.socket.onclose = function(t) {
                            s.emit("close", t.code, t.reason)
                        }, s
                    }
                    return (0, o.default)(n, [{
                        key: "send",
                        value: function(t, e, r) {
                            var n = r || e;
                            try {
                                this.socket.send(t), n()
                            } catch (t) {
                                n(t)
                            }
                        }
                    }, {
                        key: "close",
                        value: function(t, e) {
                            this.socket.close(t, e)
                        }
                    }, {
                        key: "addEventListener",
                        value: function(t, e, r) {
                            this.socket.addEventListener(t, e, r)
                        }
                    }]), n
                }(r(2614).EventEmitter)
        },
        4633: function(t, e, r) {
            "use strict";
            var n = r(891);
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.DefaultDataPack = void 0, e.createError = function(t, e) {
                var r = {
                    code: t,
                    message: s.get(t) || "Internal Server Error"
                };
                return e && (r.data = e), r
            };
            var i = n(r(1816)),
                o = n(r(7472)),
                s = new Map([
                    [-32e3, "Event not provided"],
                    [-32600, "Invalid Request"],
                    [-32601, "Method not found"],
                    [-32602, "Invalid params"],
                    [-32603, "Internal error"],
                    [-32604, "Params not found"],
                    [-32605, "Method forbidden"],
                    [-32606, "Event forbidden"],
                    [-32700, "Parse error"]
                ]),
                u = function() {
                    function t() {
                        (0, i.default)(this, t)
                    }
                    return (0, o.default)(t, [{
                        key: "encode",
                        value: function(t) {
                            return JSON.stringify(t)
                        }
                    }, {
                        key: "decode",
                        value: function(t) {
                            return JSON.parse(t)
                        }
                    }]), t
                }();
            e.DefaultDataPack = u
        },
        7226: function(t, e, r) { /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
            var n = r(3663),
                i = n.Buffer;

            function o(t, e) {
                for (var r in t) e[r] = t[r]
            }

            function s(t, e, r) {
                return i(t, e, r)
            }
            i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, e), e.Buffer = s), s.prototype = Object.create(i.prototype), o(i, s), s.from = function(t, e, r) {
                if ("number" == typeof t) throw TypeError("Argument must not be a number");
                return i(t, e, r)
            }, s.alloc = function(t, e, r) {
                if ("number" != typeof t) throw TypeError("Argument must be a number");
                var n = i(t);
                return void 0 !== e ? "string" == typeof r ? n.fill(e, r) : n.fill(e) : n.fill(0), n
            }, s.allocUnsafe = function(t) {
                if ("number" != typeof t) throw TypeError("Argument must be a number");
                return i(t)
            }, s.allocUnsafeSlow = function(t) {
                if ("number" != typeof t) throw TypeError("Argument must be a number");
                return n.SlowBuffer(t)
            }
        },
        6908: function(t, e) {
            "use strict";

            function r(t, e, r) {
                return e <= t && t <= r
            }

            function n(t) {
                if (void 0 === t) return {};
                if (t === Object(t)) return t;
                throw TypeError("Could not convert argument to dictionary")
            }

            function i(t) {
                this.tokens = [].slice.call(t)
            }

            function o(t, e) {
                if (t) throw TypeError("Decoder error");
                return e || 65533
            }
            i.prototype = {
                endOfStream: function() {
                    return !this.tokens.length
                },
                read: function() {
                    return this.tokens.length ? this.tokens.shift() : -1
                },
                prepend: function(t) {
                    if (Array.isArray(t))
                        for (; t.length;) this.tokens.unshift(t.pop());
                    else this.tokens.unshift(t)
                },
                push: function(t) {
                    if (Array.isArray(t))
                        for (; t.length;) this.tokens.push(t.shift());
                    else this.tokens.push(t)
                }
            };
            var s = "utf-8";

            function u(t, e) {
                if (!(this instanceof u)) return new u(t, e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : s) !== s) throw Error("Encoding not supported. Only utf-8 is supported");
                e = n(e), this._streaming = !1, this._BOMseen = !1, this._decoder = null, this._fatal = !!e.fatal, this._ignoreBOM = !!e.ignoreBOM, Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                }), Object.defineProperty(this, "fatal", {
                    value: this._fatal
                }), Object.defineProperty(this, "ignoreBOM", {
                    value: this._ignoreBOM
                })
            }

            function a(t, e) {
                if (!(this instanceof a)) return new a(t, e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : s) !== s) throw Error("Encoding not supported. Only utf-8 is supported");
                e = n(e), this._streaming = !1, this._encoder = null, this._options = {
                    fatal: !!e.fatal
                }, Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                })
            }

            function l(t) {
                var e = t.fatal,
                    n = 0,
                    i = 0,
                    s = 0,
                    u = 128,
                    a = 191;
                this.handler = function(t, l) {
                    if (-1 === l && 0 !== s) return s = 0, o(e);
                    if (-1 === l) return -1;
                    if (0 === s) {
                        if (r(l, 0, 127)) return l;
                        if (r(l, 194, 223)) s = 1, n = l - 192;
                        else if (r(l, 224, 239)) 224 === l && (u = 160), 237 === l && (a = 159), s = 2, n = l - 224;
                        else {
                            if (!r(l, 240, 244)) return o(e);
                            240 === l && (u = 144), 244 === l && (a = 143), s = 3, n = l - 240
                        }
                        return n <<= 6 * s, null
                    }
                    if (!r(l, u, a)) return n = s = i = 0, u = 128, a = 191, t.prepend(l), o(e);
                    if (u = 128, a = 191, i += 1, n += l - 128 << 6 * (s - i), i !== s) return null;
                    var f = n;
                    return n = s = i = 0, f
                }
            }

            function f(t) {
                t.fatal, this.handler = function(t, e) {
                    if (-1 === e) return -1;
                    if (r(e, 0, 127)) return e;
                    r(e, 128, 2047) ? (n = 1, i = 192) : r(e, 2048, 65535) ? (n = 2, i = 224) : r(e, 65536, 1114111) && (n = 3, i = 240);
                    for (var n, i, o = [(e >> 6 * n) + i]; n > 0;) {
                        var s = e >> 6 * (n - 1);
                        o.push(128 | 63 & s), n -= 1
                    }
                    return o
                }
            }
            u.prototype = {
                decode: function(t, e) {
                    r = "object" == typeof t && t instanceof ArrayBuffer ? new Uint8Array(t) : "object" == typeof t && "buffer" in t && t.buffer instanceof ArrayBuffer ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(0), e = n(e), this._streaming || (this._decoder = new l({
                        fatal: this._fatal
                    }), this._BOMseen = !1), this._streaming = !!e.stream;
                    for (var r, o, s = new i(r), u = []; !s.endOfStream() && -1 !== (o = this._decoder.handler(s, s.read()));) null !== o && (Array.isArray(o) ? u.push.apply(u, o) : u.push(o));
                    if (!this._streaming) {
                        do {
                            if (-1 === (o = this._decoder.handler(s, s.read()))) break;
                            if (null === o) continue;
                            Array.isArray(o) ? u.push.apply(u, o) : u.push(o)
                        } while (!s.endOfStream());
                        this._decoder = null
                    }
                    return !u.length || -1 === ["utf-8"].indexOf(this.encoding) || this._ignoreBOM || this._BOMseen || (65279 === u[0] ? (this._BOMseen = !0, u.shift()) : this._BOMseen = !0),
                        function(t) {
                            for (var e = "", r = 0; r < t.length; ++r) {
                                var n = t[r];
                                n <= 65535 ? e += String.fromCharCode(n) : (n -= 65536, e += String.fromCharCode((n >> 10) + 55296, (1023 & n) + 56320))
                            }
                            return e
                        }(u)
                }
            }, a.prototype = {
                encode: function(t, e) {
                    t = t ? String(t) : "", e = n(e), this._streaming || (this._encoder = new f(this._options)), this._streaming = !!e.stream;
                    for (var r, o = [], s = new i(function(t) {
                            for (var e = String(t), r = e.length, n = 0, i = []; n < r;) {
                                var o = e.charCodeAt(n);
                                if (o < 55296 || o > 57343) i.push(o);
                                else if (56320 <= o && o <= 57343) i.push(65533);
                                else if (55296 <= o && o <= 56319) {
                                    if (n === r - 1) i.push(65533);
                                    else {
                                        var s = t.charCodeAt(n + 1);
                                        if (56320 <= s && s <= 57343) {
                                            var u = 1023 & o,
                                                a = 1023 & s;
                                            i.push(65536 + (u << 10) + a), n += 1
                                        } else i.push(65533)
                                    }
                                }
                                n += 1
                            }
                            return i
                        }(t)); !s.endOfStream() && -1 !== (r = this._encoder.handler(s, s.read()));) Array.isArray(r) ? o.push.apply(o, r) : o.push(r);
                    if (!this._streaming) {
                        for (; - 1 !== (r = this._encoder.handler(s, s.read()));) Array.isArray(r) ? o.push.apply(o, r) : o.push(r);
                        this._encoder = null
                    }
                    return new Uint8Array(o)
                }
            }, e.TextEncoder = a, e.TextDecoder = u
        },
        7932: function(t, e, r) {
            "use strict";
            r.d(e, {
                v4: function() {
                    return l
                }
            });
            for (var n, i = new Uint8Array(16), o = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i, s = [], u = 0; u < 256; ++u) s.push((u + 256).toString(16).substr(1));
            var a = function(t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                        r = (s[t[e + 0]] + s[t[e + 1]] + s[t[e + 2]] + s[t[e + 3]] + "-" + s[t[e + 4]] + s[t[e + 5]] + "-" + s[t[e + 6]] + s[t[e + 7]] + "-" + s[t[e + 8]] + s[t[e + 9]] + "-" + s[t[e + 10]] + s[t[e + 11]] + s[t[e + 12]] + s[t[e + 13]] + s[t[e + 14]] + s[t[e + 15]]).toLowerCase();
                    if (!("string" == typeof r && o.test(r))) throw TypeError("Stringified UUID is invalid");
                    return r
                },
                l = function(t, e, r) {
                    var o = (t = t || {}).random || (t.rng || function() {
                        if (!n && !(n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                        return n(i)
                    })();
                    if (o[6] = 15 & o[6] | 64, o[8] = 63 & o[8] | 128, e) {
                        r = r || 0;
                        for (var s = 0; s < 16; ++s) e[r + s] = o[s];
                        return e
                    }
                    return a(o)
                }
        },
        6238: function(t) {
            t.exports = function(t) {
                if (void 0 === t) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        580: function(t) {
            function e(t, e, r, n, i, o, s) {
                try {
                    var u = t[o](s),
                        a = u.value
                } catch (t) {
                    r(t);
                    return
                }
                u.done ? e(a) : Promise.resolve(a).then(n, i)
            }
            t.exports = function(t) {
                return function() {
                    var r = this,
                        n = arguments;
                    return new Promise(function(i, o) {
                        var s = t.apply(r, n);

                        function u(t) {
                            e(s, i, o, u, a, "next", t)
                        }

                        function a(t) {
                            e(s, i, o, u, a, "throw", t)
                        }
                        u(void 0)
                    })
                }
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        1816: function(t) {
            t.exports = function(t, e) {
                if (!(t instanceof e)) throw TypeError("Cannot call a class as a function")
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        7472: function(t, e, r) {
            var n = r(853);

            function i(t, e) {
                for (var r = 0; r < e.length; r++) {
                    var i = e[r];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, n(i.key), i)
                }
            }
            t.exports = function(t, e, r) {
                return e && i(t.prototype, e), r && i(t, r), Object.defineProperty(t, "prototype", {
                    writable: !1
                }), t
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        7898: function(t) {
            function e(r) {
                return t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r)
            }
            t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        3810: function(t, e, r) {
            var n = r(5588);
            t.exports = function(t, e) {
                if ("function" != typeof e && null !== e) throw TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(t, "prototype", {
                    writable: !1
                }), e && n(t, e)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        891: function(t) {
            t.exports = function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        2242: function(t, e, r) {
            var n = r(7564).default,
                i = r(6238);
            t.exports = function(t, e) {
                if (e && ("object" === n(e) || "function" == typeof e)) return e;
                if (void 0 !== e) throw TypeError("Derived constructors may only return object or undefined");
                return i(t)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        2192: function(t, e, r) {
            var n = r(7564).default;

            function i() {
                "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
                t.exports = i = function() {
                    return r
                }, t.exports.__esModule = !0, t.exports.default = t.exports;
                var e, r = {},
                    o = Object.prototype,
                    s = o.hasOwnProperty,
                    u = Object.defineProperty || function(t, e, r) {
                        t[e] = r.value
                    },
                    a = "function" == typeof Symbol ? Symbol : {},
                    l = a.iterator || "@@iterator",
                    f = a.asyncIterator || "@@asyncIterator",
                    h = a.toStringTag || "@@toStringTag";

                function c(t, e, r) {
                    return Object.defineProperty(t, e, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }), t[e]
                }
                try {
                    c({}, "")
                } catch (t) {
                    c = function(t, e, r) {
                        return t[e] = r
                    }
                }

                function d(t, r, n, i) {
                    var o, s, a = Object.create((r && r.prototype instanceof w ? r : w).prototype);
                    return u(a, "_invoke", {
                        value: (o = new k(i || []), s = y, function(r, i) {
                            if (s === m) throw Error("Generator is already running");
                            if (s === g) {
                                if ("throw" === r) throw i;
                                return {
                                    value: e,
                                    done: !0
                                }
                            }
                            for (o.method = r, o.arg = i;;) {
                                var u = o.delegate;
                                if (u) {
                                    var a = function t(r, n) {
                                        var i = n.method,
                                            o = r.iterator[i];
                                        if (o === e) return n.delegate = null, "throw" === i && r.iterator.return && (n.method = "return", n.arg = e, t(r, n), "throw" === n.method) || "return" !== i && (n.method = "throw", n.arg = TypeError("The iterator does not provide a '" + i + "' method")), v;
                                        var s = p(o, r.iterator, n.arg);
                                        if ("throw" === s.type) return n.method = "throw", n.arg = s.arg, n.delegate = null, v;
                                        var u = s.arg;
                                        return u ? u.done ? (n[r.resultName] = u.value, n.next = r.nextLoc, "return" !== n.method && (n.method = "next", n.arg = e), n.delegate = null, v) : u : (n.method = "throw", n.arg = TypeError("iterator result is not an object"), n.delegate = null, v)
                                    }(u, o);
                                    if (a) {
                                        if (a === v) continue;
                                        return a
                                    }
                                }
                                if ("next" === o.method) o.sent = o._sent = o.arg;
                                else if ("throw" === o.method) {
                                    if (s === y) throw s = g, o.arg;
                                    o.dispatchException(o.arg)
                                } else "return" === o.method && o.abrupt("return", o.arg);
                                s = m;
                                var l = p(t, n, o);
                                if ("normal" === l.type) {
                                    if (s = o.done ? g : "suspendedYield", l.arg === v) continue;
                                    return {
                                        value: l.arg,
                                        done: o.done
                                    }
                                }
                                "throw" === l.type && (s = g, o.method = "throw", o.arg = l.arg)
                            }
                        })
                    }), a
                }

                function p(t, e, r) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, r)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                r.wrap = d;
                var y = "suspendedStart",
                    m = "executing",
                    g = "completed",
                    v = {};

                function w() {}

                function b() {}

                function E() {}
                var x = {};
                c(x, l, function() {
                    return this
                });
                var M = Object.getPrototypeOf,
                    _ = M && M(M(L([])));
                _ && _ !== o && s.call(_, l) && (x = _);
                var A = E.prototype = w.prototype = Object.create(x);

                function B(t) {
                    ["next", "throw", "return"].forEach(function(e) {
                        c(t, e, function(t) {
                            return this._invoke(e, t)
                        })
                    })
                }

                function S(t, e) {
                    var r;
                    u(this, "_invoke", {
                        value: function(i, o) {
                            function u() {
                                return new e(function(r, u) {
                                    ! function r(i, o, u, a) {
                                        var l = p(t[i], t, o);
                                        if ("throw" !== l.type) {
                                            var f = l.arg,
                                                h = f.value;
                                            return h && "object" == n(h) && s.call(h, "__await") ? e.resolve(h.__await).then(function(t) {
                                                r("next", t, u, a)
                                            }, function(t) {
                                                r("throw", t, u, a)
                                            }) : e.resolve(h).then(function(t) {
                                                f.value = t, u(f)
                                            }, function(t) {
                                                return r("throw", t, u, a)
                                            })
                                        }
                                        a(l.arg)
                                    }(i, o, r, u)
                                })
                            }
                            return r = r ? r.then(u, u) : u()
                        }
                    })
                }

                function O(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e)
                }

                function I(t) {
                    var e = t.completion || {};
                    e.type = "normal", delete e.arg, t.completion = e
                }

                function k(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }], t.forEach(O, this), this.reset(!0)
                }

                function L(t) {
                    if (t || "" === t) {
                        var r = t[l];
                        if (r) return r.call(t);
                        if ("function" == typeof t.next) return t;
                        if (!isNaN(t.length)) {
                            var i = -1,
                                o = function r() {
                                    for (; ++i < t.length;)
                                        if (s.call(t, i)) return r.value = t[i], r.done = !1, r;
                                    return r.value = e, r.done = !0, r
                                };
                            return o.next = o
                        }
                    }
                    throw TypeError(n(t) + " is not iterable")
                }
                return b.prototype = E, u(A, "constructor", {
                    value: E,
                    configurable: !0
                }), u(E, "constructor", {
                    value: b,
                    configurable: !0
                }), b.displayName = c(E, h, "GeneratorFunction"), r.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === b || "GeneratorFunction" === (e.displayName || e.name))
                }, r.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, E) : (t.__proto__ = E, c(t, h, "GeneratorFunction")), t.prototype = Object.create(A), t
                }, r.awrap = function(t) {
                    return {
                        __await: t
                    }
                }, B(S.prototype), c(S.prototype, f, function() {
                    return this
                }), r.AsyncIterator = S, r.async = function(t, e, n, i, o) {
                    void 0 === o && (o = Promise);
                    var s = new S(d(t, e, n, i), o);
                    return r.isGeneratorFunction(e) ? s : s.next().then(function(t) {
                        return t.done ? t.value : s.next()
                    })
                }, B(A), c(A, h, "Generator"), c(A, l, function() {
                    return this
                }), c(A, "toString", function() {
                    return "[object Generator]"
                }), r.keys = function(t) {
                    var e = Object(t),
                        r = [];
                    for (var n in e) r.push(n);
                    return r.reverse(),
                        function t() {
                            for (; r.length;) {
                                var n = r.pop();
                                if (n in e) return t.value = n, t.done = !1, t
                            }
                            return t.done = !0, t
                        }
                }, r.values = L, k.prototype = {
                    constructor: k,
                    reset: function(t) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(I), !t)
                            for (var r in this) "t" === r.charAt(0) && s.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type) throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done) throw t;
                        var r = this;

                        function n(n, i) {
                            return u.type = "throw", u.arg = t, r.next = n, i && (r.method = "next", r.arg = e), !!i
                        }
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var o = this.tryEntries[i],
                                u = o.completion;
                            if ("root" === o.tryLoc) return n("end");
                            if (o.tryLoc <= this.prev) {
                                var a = s.call(o, "catchLoc"),
                                    l = s.call(o, "finallyLoc");
                                if (a && l) {
                                    if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                                    if (this.prev < o.finallyLoc) return n(o.finallyLoc)
                                } else if (a) {
                                    if (this.prev < o.catchLoc) return n(o.catchLoc, !0)
                                } else {
                                    if (!l) throw Error("try statement without catch or finally");
                                    if (this.prev < o.finallyLoc) return n(o.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var n = this.tryEntries[r];
                            if (n.tryLoc <= this.prev && s.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                                var i = n;
                                break
                            }
                        }
                        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
                        var o = i ? i.completion : {};
                        return o.type = t, o.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, v) : this.complete(o)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type) throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), v
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var r = this.tryEntries[e];
                            if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), I(r), v
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var r = this.tryEntries[e];
                            if (r.tryLoc === t) {
                                var n = r.completion;
                                if ("throw" === n.type) {
                                    var i = n.arg;
                                    I(r)
                                }
                                return i
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(t, r, n) {
                        return this.delegate = {
                            iterator: L(t),
                            resultName: r,
                            nextLoc: n
                        }, "next" === this.method && (this.arg = e), v
                    }
                }, r
            }
            t.exports = i, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        5588: function(t) {
            function e(r, n) {
                return t.exports = e = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                    return t.__proto__ = e, t
                }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r, n)
            }
            t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        2272: function(t, e, r) {
            var n = r(7564).default;
            t.exports = function(t, e) {
                if ("object" != n(t) || !t) return t;
                var r = t[Symbol.toPrimitive];
                if (void 0 !== r) {
                    var i = r.call(t, e || "default");
                    if ("object" != n(i)) return i;
                    throw TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(t)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        853: function(t, e, r) {
            var n = r(7564).default,
                i = r(2272);
            t.exports = function(t) {
                var e = i(t, "string");
                return "symbol" == n(e) ? e : String(e)
            }, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        7564: function(t) {
            function e(r) {
                return t.exports = e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                } : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r)
            }
            t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports
        },
        8311: function(t, e, r) {
            var n = r(2192)();
            t.exports = n;
            try {
                regeneratorRuntime = n
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = n : Function("r", "regeneratorRuntime = r")(n)
            }
        },
        6480: function(t, e) {
            var r;
            /*!
            	Copyright (c) 2018 Jed Watson.
            	Licensed under the MIT License (MIT), see
            	http://jedwatson.github.io/classnames
            */
            ! function() {
                "use strict";
                var n = {}.hasOwnProperty;

                function i() {
                    for (var t = "", e = 0; e < arguments.length; e++) {
                        var r = arguments[e];
                        r && (t = o(t, function(t) {
                            if ("string" == typeof t || "number" == typeof t) return t;
                            if ("object" != typeof t) return "";
                            if (Array.isArray(t)) return i.apply(null, t);
                            if (t.toString !== Object.prototype.toString && !t.toString.toString().includes("[native code]")) return t.toString();
                            var e = "";
                            for (var r in t) n.call(t, r) && t[r] && (e = o(e, r));
                            return e
                        }(r)))
                    }
                    return t
                }

                function o(t, e) {
                    return e ? t ? t + " " + e : t + e : t
                }
                t.exports ? (i.default = i, t.exports = i) : void 0 !== (r = (function() {
                    return i
                }).apply(e, [])) && (t.exports = r)
            }()
        },
        2875: function(t, e, r) {
            "use strict";
            r.d(e, {
                K: function() {
                    return a
                },
                M: function() {
                    return u
                }
            });
            var n = r(2401),
                i = r(7642); /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let o = BigInt(0),
                s = BigInt(1);

            function u(t, e) {
                let r = (t, e) => {
                        let r = e.negate();
                        return t ? r : e
                    },
                    n = t => ({
                        windows: Math.ceil(e / t) + 1,
                        windowSize: 2 ** (t - 1)
                    });
                return {
                    constTimeNegate: r,
                    unsafeLadder(e, r) {
                        let n = t.ZERO,
                            i = e;
                        for (; r > o;) r & s && (n = n.add(i)), i = i.double(), r >>= s;
                        return n
                    },
                    precomputeWindow(t, e) {
                        let {
                            windows: r,
                            windowSize: i
                        } = n(e), o = [], s = t, u = s;
                        for (let t = 0; t < r; t++) {
                            u = s, o.push(u);
                            for (let t = 1; t < i; t++) u = u.add(s), o.push(u);
                            s = u.double()
                        }
                        return o
                    },
                    wNAF(e, i, o) {
                        let {
                            windows: u,
                            windowSize: a
                        } = n(e), l = t.ZERO, f = t.BASE, h = BigInt(2 ** e - 1), c = 2 ** e, d = BigInt(e);
                        for (let t = 0; t < u; t++) {
                            let e = t * a,
                                n = Number(o & h);
                            o >>= d, n > a && (n -= c, o += s);
                            let u = e + Math.abs(n) - 1,
                                p = t % 2 != 0,
                                y = n < 0;
                            0 === n ? f = f.add(r(p, i[e])) : l = l.add(r(y, i[u]))
                        }
                        return {
                            p: l,
                            f
                        }
                    },
                    wNAFCached(t, e, r, n) {
                        let i = t._WINDOW_SIZE || 1,
                            o = e.get(t);
                        return o || (o = this.precomputeWindow(t, i), 1 !== i && e.set(t, n(o))), this.wNAF(i, o, r)
                    }
                }
            }

            function a(t) {
                return (0, n.OP)(t.Fp), (0, i.FF)(t, {
                    n: "bigint",
                    h: "bigint",
                    Gx: "field",
                    Gy: "field"
                }, {
                    nBitLength: "isSafeInteger",
                    nByteLength: "isSafeInteger"
                }), Object.freeze({ ...(0, n.kK)(t.n, t.nBitLength),
                    ...t,
                    p: t.Fp.ORDER
                })
            }
        },
        2401: function(t, e, r) {
            "use strict";
            r.d(e, {
                DV: function() {
                    return w
                },
                OP: function() {
                    return m
                },
                PS: function() {
                    return E
                },
                Tu: function() {
                    return p
                },
                U_: function() {
                    return d
                },
                Us: function() {
                    return x
                },
                gN: function() {
                    return v
                },
                kK: function() {
                    return g
                },
                oA: function() {
                    return c
                },
                wQ: function() {
                    return h
                }
            });
            var n = r(7642); /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let i = BigInt(0),
                o = BigInt(1),
                s = BigInt(2),
                u = BigInt(3),
                a = BigInt(4),
                l = BigInt(5),
                f = BigInt(8);

            function h(t, e) {
                let r = t % e;
                return r >= i ? r : e + r
            }

            function c(t, e, r) {
                let n = t;
                for (; e-- > i;) n *= n, n %= r;
                return n
            }

            function d(t, e) {
                if (t === i || e <= i) throw Error(`invert: expected positive integers, got n=${t} mod=${e}`);
                let r = h(t, e),
                    n = e,
                    s = i,
                    u = o,
                    a = o,
                    l = i;
                for (; r !== i;) {
                    let t = n / r,
                        e = n % r,
                        i = s - a * t,
                        o = u - l * t;
                    n = r, r = e, s = a, u = l, a = i, l = o
                }
                if (n !== o) throw Error("invert: does not exist");
                return h(s, e)
            }
            BigInt(9), BigInt(16);
            let p = (t, e) => (h(t, e) & o) === o,
                y = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];

            function m(t) {
                let e = y.reduce((t, e) => (t[e] = "function", t), {
                    ORDER: "bigint",
                    MASK: "bigint",
                    BYTES: "isSafeInteger",
                    BITS: "isSafeInteger"
                });
                return (0, n.FF)(t, e)
            }

            function g(t, e) {
                let r = void 0 !== e ? e : t.toString(2).length;
                return {
                    nBitLength: r,
                    nByteLength: Math.ceil(r / 8)
                }
            }

            function v(t, e, r = !1, c = {}) {
                if (t <= i) throw Error(`Expected Field ORDER > 0, got ${t}`);
                let {
                    nBitLength: p,
                    nByteLength: y
                } = g(t, e);
                if (y > 2048) throw Error("Field lengths over 2048 bytes are not supported");
                let m = function(t) {
                        if (t % a === u) {
                            let e = (t + o) / a;
                            return function(t, r) {
                                let n = t.pow(r, e);
                                if (!t.eql(t.sqr(n), r)) throw Error("Cannot find square root");
                                return n
                            }
                        }
                        if (t % f === l) {
                            let e = (t - l) / f;
                            return function(t, r) {
                                let n = t.mul(r, s),
                                    i = t.pow(n, e),
                                    o = t.mul(r, i),
                                    u = t.mul(t.mul(o, s), i),
                                    a = t.mul(o, t.sub(u, t.ONE));
                                if (!t.eql(t.sqr(a), r)) throw Error("Cannot find square root");
                                return a
                            }
                        }
                        return function(t) {
                            let e, r, n;
                            let u = (t - o) / s;
                            for (e = t - o, r = 0; e % s === i; e /= s, r++);
                            for (n = s; n < t && function(t, e, r) {
                                    if (r <= i || e < i) throw Error("Expected power/modulo > 0");
                                    if (r === o) return i;
                                    let n = o;
                                    for (; e > i;) e & o && (n = n * t % r), t = t * t % r, e >>= o;
                                    return n
                                }(n, u, t) !== t - o; n++);
                            if (1 === r) {
                                let e = (t + o) / a;
                                return function(t, r) {
                                    let n = t.pow(r, e);
                                    if (!t.eql(t.sqr(n), r)) throw Error("Cannot find square root");
                                    return n
                                }
                            }
                            let l = (e + o) / s;
                            return function(t, i) {
                                if (t.pow(i, u) === t.neg(t.ONE)) throw Error("Cannot find square root");
                                let s = r,
                                    a = t.pow(t.mul(t.ONE, n), e),
                                    f = t.pow(i, l),
                                    h = t.pow(i, e);
                                for (; !t.eql(h, t.ONE);) {
                                    if (t.eql(h, t.ZERO)) return t.ZERO;
                                    let e = 1;
                                    for (let r = t.sqr(h); e < s && !t.eql(r, t.ONE); e++) r = t.sqr(r);
                                    let r = t.pow(a, o << BigInt(s - e - 1));
                                    a = t.sqr(r), f = t.mul(f, r), h = t.mul(h, a), s = e
                                }
                                return f
                            }
                        }(t)
                    }(t),
                    v = Object.freeze({
                        ORDER: t,
                        BITS: p,
                        BYTES: y,
                        MASK: (0, n.dQ)(p),
                        ZERO: i,
                        ONE: o,
                        create: e => h(e, t),
                        isValid: e => {
                            if ("bigint" != typeof e) throw Error(`Invalid field element: expected bigint, got ${typeof e}`);
                            return i <= e && e < t
                        },
                        is0: t => t === i,
                        isOdd: t => (t & o) === o,
                        neg: e => h(-e, t),
                        eql: (t, e) => t === e,
                        sqr: e => h(e * e, t),
                        add: (e, r) => h(e + r, t),
                        sub: (e, r) => h(e - r, t),
                        mul: (e, r) => h(e * r, t),
                        pow: (t, e) => (function(t, e, r) {
                            if (r < i) throw Error("Expected power > 0");
                            if (r === i) return t.ONE;
                            if (r === o) return e;
                            let n = t.ONE,
                                s = e;
                            for (; r > i;) r & o && (n = t.mul(n, s)), s = t.sqr(s), r >>= o;
                            return n
                        })(v, t, e),
                        div: (e, r) => h(e * d(r, t), t),
                        sqrN: t => t * t,
                        addN: (t, e) => t + e,
                        subN: (t, e) => t - e,
                        mulN: (t, e) => t * e,
                        inv: e => d(e, t),
                        sqrt: c.sqrt || (t => m(v, t)),
                        invertBatch: t => (function(t, e) {
                            let r = Array(e.length),
                                n = e.reduce((e, n, i) => t.is0(n) ? e : (r[i] = e, t.mul(e, n)), t.ONE),
                                i = t.inv(n);
                            return e.reduceRight((e, n, i) => t.is0(n) ? e : (r[i] = t.mul(e, r[i]), t.mul(e, n)), i), r
                        })(v, t),
                        cmov: (t, e, r) => r ? e : t,
                        toBytes: t => r ? (0, n.S5)(t, y) : (0, n.tL)(t, y),
                        fromBytes: t => {
                            if (t.length !== y) throw Error(`Fp.fromBytes: expected ${y}, got ${t.length}`);
                            return r ? (0, n.ty)(t) : (0, n.bytesToNumberBE)(t)
                        }
                    });
                return Object.freeze(v)
            }

            function w(t, e) {
                if (!t.isOdd) throw Error("Field doesn't have isOdd");
                let r = t.sqrt(e);
                return t.isOdd(r) ? t.neg(r) : r
            }

            function b(t) {
                if ("bigint" != typeof t) throw Error("field order must be bigint");
                return Math.ceil(t.toString(2).length / 8)
            }

            function E(t) {
                let e = b(t);
                return e + Math.ceil(e / 2)
            }

            function x(t, e, r = !1) {
                let i = t.length,
                    s = b(e),
                    u = E(e);
                if (i < 16 || i < u || i > 1024) throw Error(`expected ${u}-1024 bytes of input, got ${i}`);
                let a = h(r ? (0, n.bytesToNumberBE)(t) : (0, n.ty)(t), e - o) + o;
                return r ? (0, n.S5)(a, s) : (0, n.tL)(a, s)
            }
        },
        7642: function(t, e, r) {
            "use strict";
            r.d(e, {
                FF: function() {
                    return _
                },
                S5: function() {
                    return m
                },
                _t: function() {
                    return o
                },
                bytesToNumberBE: function() {
                    return d
                },
                ci: function() {
                    return a
                },
                dQ: function() {
                    return w
                },
                eV: function() {
                    return v
                },
                gk: function() {
                    return s
                },
                hexToBytes: function() {
                    return c
                },
                n$: function() {
                    return x
                },
                ql: function() {
                    return g
                },
                tL: function() {
                    return y
                },
                ty: function() {
                    return p
                }
            }), BigInt(0);
            let n = BigInt(1),
                i = BigInt(2);

            function o(t) {
                return t instanceof Uint8Array || null != t && "object" == typeof t && "Uint8Array" === t.constructor.name
            }

            function s(t) {
                if (!o(t)) throw Error("Uint8Array expected")
            }
            let u = Array.from({
                length: 256
            }, (t, e) => e.toString(16).padStart(2, "0"));

            function a(t) {
                s(t);
                let e = "";
                for (let r = 0; r < t.length; r++) e += u[t[r]];
                return e
            }

            function l(t) {
                if ("string" != typeof t) throw Error("hex string expected, got " + typeof t);
                return BigInt("" === t ? "0" : `0x${t}`)
            }
            let f = {
                _0: 48,
                _9: 57,
                _A: 65,
                _F: 70,
                _a: 97,
                _f: 102
            };

            function h(t) {
                return t >= f._0 && t <= f._9 ? t - f._0 : t >= f._A && t <= f._F ? t - (f._A - 10) : t >= f._a && t <= f._f ? t - (f._a - 10) : void 0
            }

            function c(t) {
                if ("string" != typeof t) throw Error("hex string expected, got " + typeof t);
                let e = t.length,
                    r = e / 2;
                if (e % 2) throw Error("padded hex string expected, got unpadded hex of length " + e);
                let n = new Uint8Array(r);
                for (let e = 0, i = 0; e < r; e++, i += 2) {
                    let r = h(t.charCodeAt(i)),
                        o = h(t.charCodeAt(i + 1));
                    if (void 0 === r || void 0 === o) throw Error('hex string expected, got non-hex character "' + (t[i] + t[i + 1]) + '" at index ' + i);
                    n[e] = 16 * r + o
                }
                return n
            }

            function d(t) {
                return l(a(t))
            }

            function p(t) {
                return s(t), l(a(Uint8Array.from(t).reverse()))
            }

            function y(t, e) {
                return c(t.toString(16).padStart(2 * e, "0"))
            }

            function m(t, e) {
                return y(t, e).reverse()
            }

            function g(t, e, r) {
                let n;
                if ("string" == typeof e) try {
                        n = c(e)
                    } catch (r) {
                        throw Error(`${t} must be valid hex string, got "${e}". Cause: ${r}`)
                    } else if (o(e)) n = Uint8Array.from(e);
                    else throw Error(`${t} must be hex string or Uint8Array`);
                let i = n.length;
                if ("number" == typeof r && i !== r) throw Error(`${t} expected ${r} bytes, got ${i}`);
                return n
            }

            function v(...t) {
                let e = 0;
                for (let r = 0; r < t.length; r++) {
                    let n = t[r];
                    s(n), e += n.length
                }
                let r = new Uint8Array(e);
                for (let e = 0, n = 0; e < t.length; e++) {
                    let i = t[e];
                    r.set(i, n), n += i.length
                }
                return r
            }
            let w = t => (i << BigInt(t - 1)) - n,
                b = t => new Uint8Array(t),
                E = t => Uint8Array.from(t);

            function x(t, e, r) {
                if ("number" != typeof t || t < 2) throw Error("hashLen must be a number");
                if ("number" != typeof e || e < 2) throw Error("qByteLen must be a number");
                if ("function" != typeof r) throw Error("hmacFn must be a function");
                let n = b(t),
                    i = b(t),
                    o = 0,
                    s = () => {
                        n.fill(1), i.fill(0), o = 0
                    },
                    u = (...t) => r(i, n, ...t),
                    a = (t = b()) => {
                        i = u(E([0]), t), n = u(), 0 !== t.length && (i = u(E([1]), t), n = u())
                    },
                    l = () => {
                        if (o++ >= 1e3) throw Error("drbg: tried 1000 values");
                        let t = 0,
                            r = [];
                        for (; t < e;) {
                            let e = (n = u()).slice();
                            r.push(e), t += n.length
                        }
                        return v(...r)
                    };
                return (t, e) => {
                    let r;
                    for (s(), a(t); !(r = e(l()));) a();
                    return s(), r
                }
            }
            let M = {
                bigint: t => "bigint" == typeof t,
                function: t => "function" == typeof t,
                boolean: t => "boolean" == typeof t,
                string: t => "string" == typeof t,
                stringOrUint8Array: t => "string" == typeof t || o(t),
                isSafeInteger: t => Number.isSafeInteger(t),
                array: t => Array.isArray(t),
                field: (t, e) => e.Fp.isValid(t),
                hash: t => "function" == typeof t && Number.isSafeInteger(t.outputLen)
            };

            function _(t, e, r = {}) {
                let n = (e, r, n) => {
                    let i = M[r];
                    if ("function" != typeof i) throw Error(`Invalid validator "${r}", expected function`);
                    let o = t[e];
                    if ((!n || void 0 !== o) && !i(o, t)) throw Error(`Invalid param ${String(e)}=${o} (${typeof o}), expected ${r}`)
                };
                for (let [t, r] of Object.entries(e)) n(t, r, !1);
                for (let [t, e] of Object.entries(r)) n(t, e, !0);
                return t
            }
        },
        2306: function(t, e, r) {
            "use strict";
            r.d(e, {
                UN: function() {
                    return T
                }
            });
            var n = r(717),
                i = r(4248),
                o = r(1176);
            let [s, u] = i.ZP.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(t => BigInt(t))), a = new Uint32Array(80), l = new Uint32Array(80);
            class f extends n.VR {
                constructor() {
                    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209
                }
                get() {
                    let {
                        Ah: t,
                        Al: e,
                        Bh: r,
                        Bl: n,
                        Ch: i,
                        Cl: o,
                        Dh: s,
                        Dl: u,
                        Eh: a,
                        El: l,
                        Fh: f,
                        Fl: h,
                        Gh: c,
                        Gl: d,
                        Hh: p,
                        Hl: y
                    } = this;
                    return [t, e, r, n, i, o, s, u, a, l, f, h, c, d, p, y]
                }
                set(t, e, r, n, i, o, s, u, a, l, f, h, c, d, p, y) {
                    this.Ah = 0 | t, this.Al = 0 | e, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | i, this.Cl = 0 | o, this.Dh = 0 | s, this.Dl = 0 | u, this.Eh = 0 | a, this.El = 0 | l, this.Fh = 0 | f, this.Fl = 0 | h, this.Gh = 0 | c, this.Gl = 0 | d, this.Hh = 0 | p, this.Hl = 0 | y
                }
                process(t, e) {
                    for (let r = 0; r < 16; r++, e += 4) a[r] = t.getUint32(e), l[r] = t.getUint32(e += 4);
                    for (let t = 16; t < 80; t++) {
                        let e = 0 | a[t - 15],
                            r = 0 | l[t - 15],
                            n = i.ZP.rotrSH(e, r, 1) ^ i.ZP.rotrSH(e, r, 8) ^ i.ZP.shrSH(e, r, 7),
                            o = i.ZP.rotrSL(e, r, 1) ^ i.ZP.rotrSL(e, r, 8) ^ i.ZP.shrSL(e, r, 7),
                            s = 0 | a[t - 2],
                            u = 0 | l[t - 2],
                            f = i.ZP.rotrSH(s, u, 19) ^ i.ZP.rotrBH(s, u, 61) ^ i.ZP.shrSH(s, u, 6),
                            h = i.ZP.rotrSL(s, u, 19) ^ i.ZP.rotrBL(s, u, 61) ^ i.ZP.shrSL(s, u, 6),
                            c = i.ZP.add4L(o, h, l[t - 7], l[t - 16]),
                            d = i.ZP.add4H(c, n, f, a[t - 7], a[t - 16]);
                        a[t] = 0 | d, l[t] = 0 | c
                    }
                    let {
                        Ah: r,
                        Al: n,
                        Bh: o,
                        Bl: f,
                        Ch: h,
                        Cl: c,
                        Dh: d,
                        Dl: p,
                        Eh: y,
                        El: m,
                        Fh: g,
                        Fl: v,
                        Gh: w,
                        Gl: b,
                        Hh: E,
                        Hl: x
                    } = this;
                    for (let t = 0; t < 80; t++) {
                        let e = i.ZP.rotrSH(y, m, 14) ^ i.ZP.rotrSH(y, m, 18) ^ i.ZP.rotrBH(y, m, 41),
                            M = i.ZP.rotrSL(y, m, 14) ^ i.ZP.rotrSL(y, m, 18) ^ i.ZP.rotrBL(y, m, 41),
                            _ = y & g ^ ~y & w,
                            A = m & v ^ ~m & b,
                            B = i.ZP.add5L(x, M, A, u[t], l[t]),
                            S = i.ZP.add5H(B, E, e, _, s[t], a[t]),
                            O = 0 | B,
                            I = i.ZP.rotrSH(r, n, 28) ^ i.ZP.rotrBH(r, n, 34) ^ i.ZP.rotrBH(r, n, 39),
                            k = i.ZP.rotrSL(r, n, 28) ^ i.ZP.rotrBL(r, n, 34) ^ i.ZP.rotrBL(r, n, 39),
                            L = r & o ^ r & h ^ o & h,
                            R = n & f ^ n & c ^ f & c;
                        E = 0 | w, x = 0 | b, w = 0 | g, b = 0 | v, g = 0 | y, v = 0 | m, ({
                            h: y,
                            l: m
                        } = i.ZP.add(0 | d, 0 | p, 0 | S, 0 | O)), d = 0 | h, p = 0 | c, h = 0 | o, c = 0 | f, o = 0 | r, f = 0 | n;
                        let T = i.ZP.add3L(O, k, R);
                        r = i.ZP.add3H(T, S, I, L), n = 0 | T
                    }({
                        h: r,
                        l: n
                    } = i.ZP.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                        h: o,
                        l: f
                    } = i.ZP.add(0 | this.Bh, 0 | this.Bl, 0 | o, 0 | f)), ({
                        h: h,
                        l: c
                    } = i.ZP.add(0 | this.Ch, 0 | this.Cl, 0 | h, 0 | c)), ({
                        h: d,
                        l: p
                    } = i.ZP.add(0 | this.Dh, 0 | this.Dl, 0 | d, 0 | p)), ({
                        h: y,
                        l: m
                    } = i.ZP.add(0 | this.Eh, 0 | this.El, 0 | y, 0 | m)), ({
                        h: g,
                        l: v
                    } = i.ZP.add(0 | this.Fh, 0 | this.Fl, 0 | g, 0 | v)), ({
                        h: w,
                        l: b
                    } = i.ZP.add(0 | this.Gh, 0 | this.Gl, 0 | w, 0 | b)), ({
                        h: E,
                        l: x
                    } = i.ZP.add(0 | this.Hh, 0 | this.Hl, 0 | E, 0 | x)), this.set(r, n, o, f, h, c, d, p, y, m, g, v, w, b, E, x)
                }
                roundClean() {
                    a.fill(0), l.fill(0)
                }
                destroy() {
                    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            let h = (0, o.hE)(() => new f);
            var c = r(2401),
                d = r(7642),
                p = r(2875); /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let y = BigInt(0),
                m = BigInt(1),
                g = BigInt(2),
                v = BigInt(8),
                w = {
                    zip215: !0
                },
                b = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949"),
                E = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752"),
                x = BigInt(0),
                M = BigInt(1),
                _ = BigInt(2),
                A = BigInt(5),
                B = BigInt(10),
                S = BigInt(20),
                O = BigInt(40),
                I = BigInt(80);

            function k(t, e) {
                let r = (0, c.wQ)(e * e * e, b),
                    n = function(t) {
                        let e = t * t % b * t % b,
                            r = (0, c.oA)(e, _, b) * e % b,
                            n = (0, c.oA)(r, M, b) * t % b,
                            i = (0, c.oA)(n, A, b) * n % b,
                            o = (0, c.oA)(i, B, b) * i % b,
                            s = (0, c.oA)(o, S, b) * o % b,
                            u = (0, c.oA)(s, O, b) * s % b,
                            a = (0, c.oA)(u, I, b) * u % b,
                            l = (0, c.oA)(a, I, b) * u % b,
                            f = (0, c.oA)(l, B, b) * i % b;
                        return {
                            pow_p_5_8: (0, c.oA)(f, _, b) * t % b,
                            b2: e
                        }
                    }(t * (0, c.wQ)(r * r * e, b)).pow_p_5_8,
                    i = (0, c.wQ)(t * r * n, b),
                    o = (0, c.wQ)(e * i * i, b),
                    s = i,
                    u = (0, c.wQ)(i * E, b),
                    a = o === t,
                    l = o === (0, c.wQ)(-t, b),
                    f = o === (0, c.wQ)(-t * E, b);
                return a && (i = s), (l || f) && (i = u), (0, c.Tu)(i, b) && (i = (0, c.wQ)(-i, b)), {
                    isValid: a || l,
                    value: i
                }
            }
            let L = (0, c.gN)(b, void 0, !0),
                R = {
                    a: BigInt(-1),
                    d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
                    Fp: L,
                    n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
                    h: BigInt(8),
                    Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
                    Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
                    hash: h,
                    randomBytes: o.O6,
                    adjustScalarBytes: function(t) {
                        return t[0] &= 248, t[31] &= 127, t[31] |= 64, t
                    },
                    uvRatio: k
                },
                T = function(t) {
                    let e = function(t) {
                            let e = (0, p.K)(t);
                            return d.FF(t, {
                                hash: "function",
                                a: "bigint",
                                d: "bigint",
                                randomBytes: "function"
                            }, {
                                adjustScalarBytes: "function",
                                domain: "function",
                                uvRatio: "function",
                                mapToCurve: "function"
                            }), Object.freeze({ ...e
                            })
                        }(t),
                        {
                            Fp: r,
                            n: n,
                            prehash: i,
                            hash: o,
                            randomBytes: s,
                            nByteLength: u,
                            h: a
                        } = e,
                        l = g << BigInt(8 * u) - m,
                        f = r.create,
                        h = e.uvRatio || ((t, e) => {
                            try {
                                return {
                                    isValid: !0,
                                    value: r.sqrt(t * r.inv(e))
                                }
                            } catch (t) {
                                return {
                                    isValid: !1,
                                    value: y
                                }
                            }
                        }),
                        b = e.adjustScalarBytes || (t => t),
                        E = e.domain || ((t, e, r) => {
                            if (e.length || r) throw Error("Contexts/pre-hash are not supported");
                            return t
                        }),
                        x = t => "bigint" == typeof t && y < t,
                        M = (t, e) => x(t) && x(e) && t < e,
                        _ = t => t === y || M(t, l);

                    function A(t, e) {
                        if (M(t, e)) return t;
                        throw Error(`Expected valid scalar < ${e}, got ${typeof t} ${t}`)
                    }

                    function B(t) {
                        return t === y ? t : A(t, n)
                    }
                    let S = new Map;

                    function O(t) {
                        if (!(t instanceof I)) throw Error("ExtendedPoint expected")
                    }
                    class I {
                        constructor(t, e, r, n) {
                            if (this.ex = t, this.ey = e, this.ez = r, this.et = n, !_(t)) throw Error("x required");
                            if (!_(e)) throw Error("y required");
                            if (!_(r)) throw Error("z required");
                            if (!_(n)) throw Error("t required")
                        }
                        get x() {
                            return this.toAffine().x
                        }
                        get y() {
                            return this.toAffine().y
                        }
                        static fromAffine(t) {
                            if (t instanceof I) throw Error("extended point not allowed");
                            let {
                                x: e,
                                y: r
                            } = t || {};
                            if (!_(e) || !_(r)) throw Error("invalid affine point");
                            return new I(e, r, m, f(e * r))
                        }
                        static normalizeZ(t) {
                            let e = r.invertBatch(t.map(t => t.ez));
                            return t.map((t, r) => t.toAffine(e[r])).map(I.fromAffine)
                        }
                        _setWindowSize(t) {
                            this._WINDOW_SIZE = t, S.delete(this)
                        }
                        assertValidity() {
                            let {
                                a: t,
                                d: r
                            } = e;
                            if (this.is0()) throw Error("bad point: ZERO");
                            let {
                                ex: n,
                                ey: i,
                                ez: o,
                                et: s
                            } = this, u = f(n * n), a = f(i * i), l = f(o * o), h = f(l * l), c = f(u * t);
                            if (f(l * f(c + a)) !== f(h + f(r * f(u * a)))) throw Error("bad point: equation left != right (1)");
                            if (f(n * i) !== f(o * s)) throw Error("bad point: equation left != right (2)")
                        }
                        equals(t) {
                            O(t);
                            let {
                                ex: e,
                                ey: r,
                                ez: n
                            } = this, {
                                ex: i,
                                ey: o,
                                ez: s
                            } = t, u = f(e * s), a = f(i * n), l = f(r * s), h = f(o * n);
                            return u === a && l === h
                        }
                        is0() {
                            return this.equals(I.ZERO)
                        }
                        negate() {
                            return new I(f(-this.ex), this.ey, this.ez, f(-this.et))
                        }
                        double() {
                            let {
                                a: t
                            } = e, {
                                ex: r,
                                ey: n,
                                ez: i
                            } = this, o = f(r * r), s = f(n * n), u = f(g * f(i * i)), a = f(t * o), l = r + n, h = f(f(l * l) - o - s), c = a + s, d = c - u, p = a - s, y = f(h * d), m = f(c * p), v = f(h * p);
                            return new I(y, m, f(d * c), v)
                        }
                        add(t) {
                            O(t);
                            let {
                                a: r,
                                d: n
                            } = e, {
                                ex: i,
                                ey: o,
                                ez: s,
                                et: u
                            } = this, {
                                ex: a,
                                ey: l,
                                ez: h,
                                et: c
                            } = t;
                            if (r === BigInt(-1)) {
                                let t = f((o - i) * (l + a)),
                                    e = f((o + i) * (l - a)),
                                    r = f(e - t);
                                if (r === y) return this.double();
                                let n = f(s * g * c),
                                    d = f(u * g * h),
                                    p = d + n,
                                    m = e + t,
                                    v = d - n,
                                    w = f(p * r),
                                    b = f(m * v),
                                    E = f(p * v);
                                return new I(w, b, f(r * m), E)
                            }
                            let d = f(i * a),
                                p = f(o * l),
                                m = f(u * n * c),
                                v = f(s * h),
                                w = f((i + o) * (a + l) - d - p),
                                b = v - m,
                                E = v + m,
                                x = f(p - r * d),
                                M = f(w * b),
                                _ = f(E * x),
                                A = f(w * x);
                            return new I(M, _, f(b * E), A)
                        }
                        subtract(t) {
                            return this.add(t.negate())
                        }
                        wNAF(t) {
                            return R.wNAFCached(this, S, t, I.normalizeZ)
                        }
                        multiply(t) {
                            let {
                                p: e,
                                f: r
                            } = this.wNAF(A(t, n));
                            return I.normalizeZ([e, r])[0]
                        }
                        multiplyUnsafe(t) {
                            let e = B(t);
                            return e === y ? L : this.equals(L) || e === m ? this : this.equals(k) ? this.wNAF(e).p : R.unsafeLadder(this, e)
                        }
                        isSmallOrder() {
                            return this.multiplyUnsafe(a).is0()
                        }
                        isTorsionFree() {
                            return R.unsafeLadder(this, n).is0()
                        }
                        toAffine(t) {
                            let {
                                ex: e,
                                ey: n,
                                ez: i
                            } = this, o = this.is0();
                            null == t && (t = o ? v : r.inv(i));
                            let s = f(e * t),
                                u = f(n * t),
                                a = f(i * t);
                            if (o) return {
                                x: y,
                                y: m
                            };
                            if (a !== m) throw Error("invZ was invalid");
                            return {
                                x: s,
                                y: u
                            }
                        }
                        clearCofactor() {
                            let {
                                h: t
                            } = e;
                            return t === m ? this : this.multiplyUnsafe(t)
                        }
                        static fromHex(t, n = !1) {
                            let {
                                d: i,
                                a: o
                            } = e, s = r.BYTES, u = (t = (0, d.ql)("pointHex", t, s)).slice(), a = t[s - 1];
                            u[s - 1] = -129 & a;
                            let c = d.ty(u);
                            c === y || (n ? A(c, l) : A(c, r.ORDER));
                            let p = f(c * c),
                                {
                                    isValid: g,
                                    value: v
                                } = h(f(p - m), f(i * p - o));
                            if (!g) throw Error("Point.fromHex: invalid y coordinate");
                            let w = (v & m) === m,
                                b = (128 & a) != 0;
                            if (!n && v === y && b) throw Error("Point.fromHex: x=0 and x_0=1");
                            return b !== w && (v = f(-v)), I.fromAffine({
                                x: v,
                                y: c
                            })
                        }
                        static fromPrivateKey(t) {
                            return U(t).point
                        }
                        toRawBytes() {
                            let {
                                x: t,
                                y: e
                            } = this.toAffine(), n = d.S5(e, r.BYTES);
                            return n[n.length - 1] |= t & m ? 128 : 0, n
                        }
                        toHex() {
                            return d.ci(this.toRawBytes())
                        }
                    }
                    I.BASE = new I(e.Gx, e.Gy, m, f(e.Gx * e.Gy)), I.ZERO = new I(y, m, m, y);
                    let {
                        BASE: k,
                        ZERO: L
                    } = I, R = (0, p.M)(I, 8 * u);

                    function T(t) {
                        var e;
                        return e = d.ty(t), (0, c.wQ)(e, n)
                    }

                    function U(t) {
                        t = (0, d.ql)("private key", t, u);
                        let e = (0, d.ql)("hashed private key", o(t), 2 * u),
                            r = b(e.slice(0, u)),
                            n = e.slice(u, 2 * u),
                            i = T(r),
                            s = k.multiply(i),
                            a = s.toRawBytes();
                        return {
                            head: r,
                            prefix: n,
                            scalar: i,
                            point: s,
                            pointBytes: a
                        }
                    }

                    function P(t = new Uint8Array, ...e) {
                        return T(o(E(d.eV(...e), (0, d.ql)("context", t), !!i)))
                    }
                    return k._setWindowSize(8), {
                        CURVE: e,
                        getPublicKey: function(t) {
                            return U(t).pointBytes
                        },
                        sign: function(t, e, o = {}) {
                            var s;
                            t = (0, d.ql)("message", t), i && (t = i(t));
                            let {
                                prefix: a,
                                scalar: l,
                                pointBytes: f
                            } = U(e), h = P(o.context, a, t), p = k.multiply(h).toRawBytes(), y = (s = h + P(o.context, p, f, t) * l, (0, c.wQ)(s, n));
                            B(y);
                            let m = d.eV(p, d.S5(y, r.BYTES));
                            return (0, d.ql)("result", m, 2 * u)
                        },
                        verify: function(t, e, n, o = w) {
                            let s, u, a;
                            let {
                                context: l,
                                zip215: f
                            } = o, h = r.BYTES;
                            t = (0, d.ql)("signature", t, 2 * h), e = (0, d.ql)("message", e), i && (e = i(e));
                            let c = d.ty(t.slice(h, 2 * h));
                            try {
                                s = I.fromHex(n, f), u = I.fromHex(t.slice(0, h), f), a = k.multiplyUnsafe(c)
                            } catch (t) {
                                return !1
                            }
                            if (!f && s.isSmallOrder()) return !1;
                            let p = P(l, u.toRawBytes(), s.toRawBytes(), e);
                            return u.add(s.multiplyUnsafe(p)).subtract(a).clearCofactor().equals(I.ZERO)
                        },
                        ExtendedPoint: I,
                        utils: {
                            getExtendedPublicKey: U,
                            randomPrivateKey: () => s(r.BYTES),
                            precompute: (t = 8, e = I.BASE) => (e._setWindowSize(t), e.multiply(BigInt(3)), e)
                        }
                    }
                }(R);
            ({ ...R
            });
            let U = (L.ORDER + BigInt(3)) / BigInt(8);

            function P(t) {
                if (!(t instanceof Z)) throw Error("RistrettoPoint expected")
            }
            L.pow(_, U), L.sqrt(L.neg(L.ONE)), L.ORDER, BigInt(5), BigInt(8), BigInt(486662), (0, c.DV)(L, L.neg(BigInt(486664)));
            let C = BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235"),
                N = BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"),
                j = BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838"),
                q = BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952"),
                F = t => k(M, t),
                z = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
                $ = t => T.CURVE.Fp.create(bytesToNumberLE(t) & z);

            function D(t) {
                let {
                    d: e
                } = T.CURVE, r = T.CURVE.Fp.ORDER, n = T.CURVE.Fp.create, i = n(null * t * t), o = n((i + M) * j), s = BigInt(-1), u = n((s - e * i) * n(i + e)), {
                    isValid: a,
                    value: l
                } = k(o, u), f = n(l * t);
                isNegativeLE(f, r) || (f = n(-f)), a || (l = f), a || (s = i);
                let h = n(s * (i - M) * q - u),
                    c = l * l,
                    d = n((l + l) * u),
                    p = n(h * C),
                    y = n(M - c),
                    m = n(M + c);
                return new T.ExtendedPoint(n(d * m), n(y * p), n(p * m), n(d * y))
            }
            class Z {
                constructor(t) {
                    this.ep = t
                }
                static fromAffine(t) {
                    return new Z(T.ExtendedPoint.fromAffine(t))
                }
                static hashToCurve(t) {
                    let e = D($((t = ensureBytes("ristrettoHash", t, 64)).slice(0, 32))),
                        r = D($(t.slice(32, 64)));
                    return new Z(e.add(r))
                }
                static fromHex(t) {
                    t = ensureBytes("ristrettoHex", t, 32);
                    let {
                        a: e,
                        d: r
                    } = T.CURVE, n = T.CURVE.Fp.ORDER, i = T.CURVE.Fp.create, o = "RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint", s = $(t);
                    if (!equalBytes(numberToBytesLE(s, 32), t) || isNegativeLE(s, n)) throw Error(o);
                    let u = i(s * s),
                        a = i(M + e * u),
                        l = i(M - e * u),
                        f = i(a * a),
                        h = i(l * l),
                        c = i(e * r * f - h),
                        {
                            isValid: d,
                            value: p
                        } = F(i(c * h)),
                        y = i(p * l),
                        m = i(p * y * c),
                        g = i((s + s) * y);
                    isNegativeLE(g, n) && (g = i(-g));
                    let v = i(a * m),
                        w = i(g * v);
                    if (!d || isNegativeLE(w, n) || v === x) throw Error(o);
                    return new Z(new T.ExtendedPoint(g, v, M, w))
                }
                toRawBytes() {
                    let t, {
                            ex: e,
                            ey: r,
                            ez: n,
                            et: i
                        } = this.ep,
                        o = T.CURVE.Fp.ORDER,
                        s = T.CURVE.Fp.create,
                        u = s(s(n + r) * s(n - r)),
                        a = s(e * r),
                        l = s(a * a),
                        {
                            value: f
                        } = F(s(u * l)),
                        h = s(f * u),
                        c = s(f * a),
                        d = s(h * c * i);
                    if (isNegativeLE(i * d, o)) {
                        let n = s(null * r),
                            i = s(null * e);
                        e = n, r = i, t = s(h * N)
                    } else t = c;
                    isNegativeLE(e * d, o) && (r = s(-r));
                    let p = s((n - r) * t);
                    return isNegativeLE(p, o) && (p = s(-p)), numberToBytesLE(p, 32)
                }
                toHex() {
                    return bytesToHex(this.toRawBytes())
                }
                toString() {
                    return this.toHex()
                }
                equals(t) {
                    P(t);
                    let {
                        ex: e,
                        ey: r
                    } = this.ep, {
                        ex: n,
                        ey: i
                    } = t.ep, o = T.CURVE.Fp.create, s = o(e * i) === o(r * n), u = o(r * i) === o(e * n);
                    return s || u
                }
                add(t) {
                    return P(t), new Z(this.ep.add(t.ep))
                }
                subtract(t) {
                    return P(t), new Z(this.ep.subtract(t.ep))
                }
                multiply(t) {
                    return new Z(this.ep.multiply(t))
                }
                multiplyUnsafe(t) {
                    return new Z(this.ep.multiplyUnsafe(t))
                }
                double() {
                    return new Z(this.ep.double())
                }
                negate() {
                    return new Z(this.ep.negate())
                }
            }
        },
        8923: function(t, e, r) {
            "use strict";
            r.d(e, {
                kA: function() {
                    return M
                }
            });
            var n = r(3940),
                i = r(2401),
                o = r(4374),
                s = r(1176);
            class u extends s.kb {
                constructor(t, e) {
                    super(), this.finished = !1, this.destroyed = !1, (0, o.vp)(t);
                    let r = (0, s.O0)(e);
                    if (this.iHash = t.create(), "function" != typeof this.iHash.update) throw Error("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
                    let n = this.blockLen,
                        i = new Uint8Array(n);
                    i.set(r.length > n ? t.create().update(r).digest() : r);
                    for (let t = 0; t < i.length; t++) i[t] ^= 54;
                    this.iHash.update(i), this.oHash = t.create();
                    for (let t = 0; t < i.length; t++) i[t] ^= 106;
                    this.oHash.update(i), i.fill(0)
                }
                update(t) {
                    return (0, o.Gg)(this), this.iHash.update(t), this
                }
                digestInto(t) {
                    (0, o.Gg)(this), (0, o.aI)(t, this.outputLen), this.finished = !0, this.iHash.digestInto(t), this.oHash.update(t), this.oHash.digestInto(t), this.destroy()
                }
                digest() {
                    let t = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(t), t
                }
                _cloneInto(t) {
                    t || (t = Object.create(Object.getPrototypeOf(this), {}));
                    let {
                        oHash: e,
                        iHash: r,
                        finished: n,
                        destroyed: i,
                        blockLen: o,
                        outputLen: s
                    } = this;
                    return t.finished = n, t.destroyed = i, t.blockLen = o, t.outputLen = s, t.oHash = e._cloneInto(t.oHash), t.iHash = r._cloneInto(t.iHash), t
                }
                destroy() {
                    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy()
                }
            }
            let a = (t, e, r) => new u(t, e).update(r).digest();
            a.create = (t, e) => new u(t, e);
            var l = r(7642),
                f = r(2875);
            let {
                bytesToNumberBE: h,
                hexToBytes: c
            } = l, d = {
                Err: class extends Error {
                    constructor(t = "") {
                        super(t)
                    }
                },
                _parseInt(t) {
                    let {
                        Err: e
                    } = d;
                    if (t.length < 2 || 2 !== t[0]) throw new e("Invalid signature integer tag");
                    let r = t[1],
                        n = t.subarray(2, r + 2);
                    if (!r || n.length !== r) throw new e("Invalid signature integer: wrong length");
                    if (128 & n[0]) throw new e("Invalid signature integer: negative");
                    if (0 === n[0] && !(128 & n[1])) throw new e("Invalid signature integer: unnecessary leading zero");
                    return {
                        d: h(n),
                        l: t.subarray(r + 2)
                    }
                },
                toSig(t) {
                    let {
                        Err: e
                    } = d, r = "string" == typeof t ? c(t) : t;
                    l.gk(r);
                    let n = r.length;
                    if (n < 2 || 48 != r[0]) throw new e("Invalid signature tag");
                    if (r[1] !== n - 2) throw new e("Invalid signature: incorrect length");
                    let {
                        d: i,
                        l: o
                    } = d._parseInt(r.subarray(2)), {
                        d: s,
                        l: u
                    } = d._parseInt(o);
                    if (u.length) throw new e("Invalid signature: left bytes after parsing");
                    return {
                        r: i,
                        s
                    }
                },
                hexFromSig(t) {
                    let e = t => 8 & Number.parseInt(t[0], 16) ? "00" + t : t,
                        r = t => {
                            let e = t.toString(16);
                            return 1 & e.length ? `0${e}` : e
                        },
                        n = e(r(t.s)),
                        i = e(r(t.r)),
                        o = n.length / 2,
                        s = i.length / 2,
                        u = r(o),
                        a = r(s);
                    return `30${r(s+o+4)}02${a}${i}02${u}${n}`
                }
            }, p = BigInt(0), y = BigInt(1), m = (BigInt(2), BigInt(3));
            BigInt(4); /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let g = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
                v = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
                w = BigInt(1),
                b = BigInt(2),
                E = (t, e) => (t + e / b) / e,
                x = (0, i.gN)(g, void 0, void 0, {
                    sqrt: function(t) {
                        let e = BigInt(3),
                            r = BigInt(6),
                            n = BigInt(11),
                            o = BigInt(22),
                            s = BigInt(23),
                            u = BigInt(44),
                            a = BigInt(88),
                            l = t * t * t % g,
                            f = l * l * t % g,
                            h = (0, i.oA)(f, e, g) * f % g,
                            c = (0, i.oA)(h, e, g) * f % g,
                            d = (0, i.oA)(c, b, g) * l % g,
                            p = (0, i.oA)(d, n, g) * d % g,
                            y = (0, i.oA)(p, o, g) * p % g,
                            m = (0, i.oA)(y, u, g) * y % g,
                            v = (0, i.oA)(m, a, g) * m % g,
                            w = (0, i.oA)(v, u, g) * y % g,
                            E = (0, i.oA)(w, e, g) * f % g,
                            M = (0, i.oA)(E, s, g) * p % g,
                            _ = (0, i.oA)(M, r, g) * l % g,
                            A = (0, i.oA)(_, b, g);
                        if (!x.eql(x.sqr(A), t)) throw Error("Cannot find square root");
                        return A
                    }
                }),
                M = function(t, e) {
                    let r = e => (function(t) {
                        let e = function(t) {
                                let e = (0, f.K)(t);
                                return l.FF(e, {
                                    hash: "hash",
                                    hmac: "function",
                                    randomBytes: "function"
                                }, {
                                    bits2int: "function",
                                    bits2int_modN: "function",
                                    lowS: "boolean"
                                }), Object.freeze({
                                    lowS: !0,
                                    ...e
                                })
                            }(t),
                            {
                                Fp: r,
                                n: n
                            } = e,
                            o = r.BYTES + 1,
                            s = 2 * r.BYTES + 1;

                        function u(t) {
                            return i.wQ(t, n)
                        }

                        function a(t) {
                            return i.U_(t, n)
                        }
                        let {
                            ProjectivePoint: h,
                            normPrivateKeyToScalar: c,
                            weierstrassEquation: g,
                            isWithinCurveOrder: v
                        } = function(t) {
                            let e = /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ function(t) {
                                    let e = (0, f.K)(t);
                                    l.FF(e, {
                                        a: "field",
                                        b: "field"
                                    }, {
                                        allowedPrivateKeyLengths: "array",
                                        wrapPrivateKey: "boolean",
                                        isTorsionFree: "function",
                                        clearCofactor: "function",
                                        allowInfinityPoint: "boolean",
                                        fromBytes: "function",
                                        toBytes: "function"
                                    });
                                    let {
                                        endo: r,
                                        Fp: n,
                                        a: i
                                    } = e;
                                    if (r) {
                                        if (!n.eql(i, n.ZERO)) throw Error("Endomorphism can only be defined for Koblitz curves that have a=0");
                                        if ("object" != typeof r || "bigint" != typeof r.beta || "function" != typeof r.splitScalar) throw Error("Expected endomorphism with beta: bigint and splitScalar: function")
                                    }
                                    return Object.freeze({ ...e
                                    })
                                }(t),
                                {
                                    Fp: r
                                } = e,
                                n = e.toBytes || ((t, e, n) => {
                                    let i = e.toAffine();
                                    return l.eV(Uint8Array.from([4]), r.toBytes(i.x), r.toBytes(i.y))
                                }),
                                o = e.fromBytes || (t => {
                                    let e = t.subarray(1);
                                    return {
                                        x: r.fromBytes(e.subarray(0, r.BYTES)),
                                        y: r.fromBytes(e.subarray(r.BYTES, 2 * r.BYTES))
                                    }
                                });

                            function s(t) {
                                let {
                                    a: n,
                                    b: i
                                } = e, o = r.sqr(t), s = r.mul(o, t);
                                return r.add(r.add(s, r.mul(t, n)), i)
                            }
                            if (!r.eql(r.sqr(e.Gy), s(e.Gx))) throw Error("bad generator point: equation left != right");

                            function u(t) {
                                return "bigint" == typeof t && p < t && t < e.n
                            }

                            function a(t) {
                                if (!u(t)) throw Error("Expected valid bigint: 0 < bigint < curve.n")
                            }

                            function h(t) {
                                let r;
                                let {
                                    allowedPrivateKeyLengths: n,
                                    nByteLength: o,
                                    wrapPrivateKey: s,
                                    n: u
                                } = e;
                                if (n && "bigint" != typeof t) {
                                    if (l._t(t) && (t = l.ci(t)), "string" != typeof t || !n.includes(t.length)) throw Error("Invalid key");
                                    t = t.padStart(2 * o, "0")
                                }
                                try {
                                    r = "bigint" == typeof t ? t : l.bytesToNumberBE((0, l.ql)("private key", t, o))
                                } catch (e) {
                                    throw Error(`private key must be ${o} bytes, hex or bigint, not ${typeof t}`)
                                }
                                return s && (r = i.wQ(r, u)), a(r), r
                            }
                            let c = new Map;

                            function d(t) {
                                if (!(t instanceof g)) throw Error("ProjectivePoint expected")
                            }
                            class g {
                                constructor(t, e, n) {
                                    if (this.px = t, this.py = e, this.pz = n, null == t || !r.isValid(t)) throw Error("x required");
                                    if (null == e || !r.isValid(e)) throw Error("y required");
                                    if (null == n || !r.isValid(n)) throw Error("z required")
                                }
                                static fromAffine(t) {
                                    let {
                                        x: e,
                                        y: n
                                    } = t || {};
                                    if (!t || !r.isValid(e) || !r.isValid(n)) throw Error("invalid affine point");
                                    if (t instanceof g) throw Error("projective point not allowed");
                                    let i = t => r.eql(t, r.ZERO);
                                    return i(e) && i(n) ? g.ZERO : new g(e, n, r.ONE)
                                }
                                get x() {
                                    return this.toAffine().x
                                }
                                get y() {
                                    return this.toAffine().y
                                }
                                static normalizeZ(t) {
                                    let e = r.invertBatch(t.map(t => t.pz));
                                    return t.map((t, r) => t.toAffine(e[r])).map(g.fromAffine)
                                }
                                static fromHex(t) {
                                    let e = g.fromAffine(o((0, l.ql)("pointHex", t)));
                                    return e.assertValidity(), e
                                }
                                static fromPrivateKey(t) {
                                    return g.BASE.multiply(h(t))
                                }
                                _setWindowSize(t) {
                                    this._WINDOW_SIZE = t, c.delete(this)
                                }
                                assertValidity() {
                                    if (this.is0()) {
                                        if (e.allowInfinityPoint && !r.is0(this.py)) return;
                                        throw Error("bad point: ZERO")
                                    }
                                    let {
                                        x: t,
                                        y: n
                                    } = this.toAffine();
                                    if (!r.isValid(t) || !r.isValid(n)) throw Error("bad point: x or y not FE");
                                    let i = r.sqr(n),
                                        o = s(t);
                                    if (!r.eql(i, o)) throw Error("bad point: equation left != right");
                                    if (!this.isTorsionFree()) throw Error("bad point: not in prime-order subgroup")
                                }
                                hasEvenY() {
                                    let {
                                        y: t
                                    } = this.toAffine();
                                    if (r.isOdd) return !r.isOdd(t);
                                    throw Error("Field doesn't support isOdd")
                                }
                                equals(t) {
                                    d(t);
                                    let {
                                        px: e,
                                        py: n,
                                        pz: i
                                    } = this, {
                                        px: o,
                                        py: s,
                                        pz: u
                                    } = t, a = r.eql(r.mul(e, u), r.mul(o, i)), l = r.eql(r.mul(n, u), r.mul(s, i));
                                    return a && l
                                }
                                negate() {
                                    return new g(this.px, r.neg(this.py), this.pz)
                                }
                                double() {
                                    let {
                                        a: t,
                                        b: n
                                    } = e, i = r.mul(n, m), {
                                        px: o,
                                        py: s,
                                        pz: u
                                    } = this, a = r.ZERO, l = r.ZERO, f = r.ZERO, h = r.mul(o, o), c = r.mul(s, s), d = r.mul(u, u), p = r.mul(o, s);
                                    return p = r.add(p, p), f = r.mul(o, u), f = r.add(f, f), a = r.mul(t, f), l = r.mul(i, d), l = r.add(a, l), a = r.sub(c, l), l = r.add(c, l), l = r.mul(a, l), a = r.mul(p, a), f = r.mul(i, f), d = r.mul(t, d), p = r.sub(h, d), p = r.mul(t, p), p = r.add(p, f), f = r.add(h, h), h = r.add(f, h), h = r.add(h, d), h = r.mul(h, p), l = r.add(l, h), d = r.mul(s, u), d = r.add(d, d), h = r.mul(d, p), a = r.sub(a, h), f = r.mul(d, c), f = r.add(f, f), new g(a, l, f = r.add(f, f))
                                }
                                add(t) {
                                    d(t);
                                    let {
                                        px: n,
                                        py: i,
                                        pz: o
                                    } = this, {
                                        px: s,
                                        py: u,
                                        pz: a
                                    } = t, l = r.ZERO, f = r.ZERO, h = r.ZERO, c = e.a, p = r.mul(e.b, m), y = r.mul(n, s), v = r.mul(i, u), w = r.mul(o, a), b = r.add(n, i), E = r.add(s, u);
                                    b = r.mul(b, E), E = r.add(y, v), b = r.sub(b, E), E = r.add(n, o);
                                    let x = r.add(s, a);
                                    return E = r.mul(E, x), x = r.add(y, w), E = r.sub(E, x), x = r.add(i, o), l = r.add(u, a), x = r.mul(x, l), l = r.add(v, w), x = r.sub(x, l), h = r.mul(c, E), l = r.mul(p, w), h = r.add(l, h), l = r.sub(v, h), h = r.add(v, h), f = r.mul(l, h), v = r.add(y, y), v = r.add(v, y), w = r.mul(c, w), E = r.mul(p, E), v = r.add(v, w), w = r.sub(y, w), w = r.mul(c, w), E = r.add(E, w), y = r.mul(v, E), f = r.add(f, y), y = r.mul(x, E), l = r.mul(b, l), l = r.sub(l, y), y = r.mul(b, v), h = r.mul(x, h), new g(l, f, h = r.add(h, y))
                                }
                                subtract(t) {
                                    return this.add(t.negate())
                                }
                                is0() {
                                    return this.equals(g.ZERO)
                                }
                                wNAF(t) {
                                    return w.wNAFCached(this, c, t, t => {
                                        let e = r.invertBatch(t.map(t => t.pz));
                                        return t.map((t, r) => t.toAffine(e[r])).map(g.fromAffine)
                                    })
                                }
                                multiplyUnsafe(t) {
                                    let n = g.ZERO;
                                    if (t === p) return n;
                                    if (a(t), t === y) return this;
                                    let {
                                        endo: i
                                    } = e;
                                    if (!i) return w.unsafeLadder(this, t);
                                    let {
                                        k1neg: o,
                                        k1: s,
                                        k2neg: u,
                                        k2: l
                                    } = i.splitScalar(t), f = n, h = n, c = this;
                                    for (; s > p || l > p;) s & y && (f = f.add(c)), l & y && (h = h.add(c)), c = c.double(), s >>= y, l >>= y;
                                    return o && (f = f.negate()), u && (h = h.negate()), h = new g(r.mul(h.px, i.beta), h.py, h.pz), f.add(h)
                                }
                                multiply(t) {
                                    let n, i;
                                    a(t);
                                    let {
                                        endo: o
                                    } = e;
                                    if (o) {
                                        let {
                                            k1neg: e,
                                            k1: s,
                                            k2neg: u,
                                            k2: a
                                        } = o.splitScalar(t), {
                                            p: l,
                                            f: f
                                        } = this.wNAF(s), {
                                            p: h,
                                            f: c
                                        } = this.wNAF(a);
                                        l = w.constTimeNegate(e, l), h = w.constTimeNegate(u, h), h = new g(r.mul(h.px, o.beta), h.py, h.pz), n = l.add(h), i = f.add(c)
                                    } else {
                                        let {
                                            p: e,
                                            f: r
                                        } = this.wNAF(t);
                                        n = e, i = r
                                    }
                                    return g.normalizeZ([n, i])[0]
                                }
                                multiplyAndAddUnsafe(t, e, r) {
                                    let n = g.BASE,
                                        i = (t, e) => e !== p && e !== y && t.equals(n) ? t.multiply(e) : t.multiplyUnsafe(e),
                                        o = i(this, e).add(i(t, r));
                                    return o.is0() ? void 0 : o
                                }
                                toAffine(t) {
                                    let {
                                        px: e,
                                        py: n,
                                        pz: i
                                    } = this, o = this.is0();
                                    null == t && (t = o ? r.ONE : r.inv(i));
                                    let s = r.mul(e, t),
                                        u = r.mul(n, t),
                                        a = r.mul(i, t);
                                    if (o) return {
                                        x: r.ZERO,
                                        y: r.ZERO
                                    };
                                    if (!r.eql(a, r.ONE)) throw Error("invZ was invalid");
                                    return {
                                        x: s,
                                        y: u
                                    }
                                }
                                isTorsionFree() {
                                    let {
                                        h: t,
                                        isTorsionFree: r
                                    } = e;
                                    if (t === y) return !0;
                                    if (r) return r(g, this);
                                    throw Error("isTorsionFree() has not been declared for the elliptic curve")
                                }
                                clearCofactor() {
                                    let {
                                        h: t,
                                        clearCofactor: r
                                    } = e;
                                    return t === y ? this : r ? r(g, this) : this.multiplyUnsafe(e.h)
                                }
                                toRawBytes(t = !0) {
                                    return this.assertValidity(), n(g, this, t)
                                }
                                toHex(t = !0) {
                                    return l.ci(this.toRawBytes(t))
                                }
                            }
                            g.BASE = new g(e.Gx, e.Gy, r.ONE), g.ZERO = new g(r.ZERO, r.ONE, r.ZERO);
                            let v = e.nBitLength,
                                w = (0, f.M)(g, e.endo ? Math.ceil(v / 2) : v);
                            return {
                                CURVE: e,
                                ProjectivePoint: g,
                                normPrivateKeyToScalar: h,
                                weierstrassEquation: s,
                                isWithinCurveOrder: u
                            }
                        }({ ...e,
                            toBytes(t, e, n) {
                                let i = e.toAffine(),
                                    o = r.toBytes(i.x),
                                    s = l.eV;
                                return n ? s(Uint8Array.from([e.hasEvenY() ? 2 : 3]), o) : s(Uint8Array.from([4]), o, r.toBytes(i.y))
                            },
                            fromBytes(t) {
                                let e = t.length,
                                    n = t[0],
                                    i = t.subarray(1);
                                if (e === o && (2 === n || 3 === n)) {
                                    let t;
                                    let e = l.bytesToNumberBE(i);
                                    if (!(p < e && e < r.ORDER)) throw Error("Point is not on curve");
                                    let o = g(e);
                                    try {
                                        t = r.sqrt(o)
                                    } catch (t) {
                                        throw Error("Point is not on curve" + (t instanceof Error ? ": " + t.message : ""))
                                    }
                                    return (1 & n) == 1 != ((t & y) === y) && (t = r.neg(t)), {
                                        x: e,
                                        y: t
                                    }
                                }
                                if (e === s && 4 === n) return {
                                    x: r.fromBytes(i.subarray(0, r.BYTES)),
                                    y: r.fromBytes(i.subarray(r.BYTES, 2 * r.BYTES))
                                };
                                throw Error(`Point of length ${e} was invalid. Expected ${o} compressed bytes or ${s} uncompressed bytes`)
                            }
                        }), w = t => l.ci(l.tL(t, e.nByteLength)), b = (t, e, r) => l.bytesToNumberBE(t.slice(e, r));
                        class E {
                            constructor(t, e, r) {
                                this.r = t, this.s = e, this.recovery = r, this.assertValidity()
                            }
                            static fromCompact(t) {
                                let r = e.nByteLength;
                                return new E(b(t = (0, l.ql)("compactSignature", t, 2 * r), 0, r), b(t, r, 2 * r))
                            }
                            static fromDER(t) {
                                let {
                                    r: e,
                                    s: r
                                } = d.toSig((0, l.ql)("DER", t));
                                return new E(e, r)
                            }
                            assertValidity() {
                                if (!v(this.r)) throw Error("r must be 0 < r < CURVE.n");
                                if (!v(this.s)) throw Error("s must be 0 < s < CURVE.n")
                            }
                            addRecoveryBit(t) {
                                return new E(this.r, this.s, t)
                            }
                            recoverPublicKey(t) {
                                let {
                                    r: n,
                                    s: i,
                                    recovery: o
                                } = this, s = _((0, l.ql)("msgHash", t));
                                if (null == o || ![0, 1, 2, 3].includes(o)) throw Error("recovery id invalid");
                                let f = 2 === o || 3 === o ? n + e.n : n;
                                if (f >= r.ORDER) throw Error("recovery id 2 or 3 invalid");
                                let c = (1 & o) == 0 ? "02" : "03",
                                    d = h.fromHex(c + w(f)),
                                    p = a(f),
                                    y = u(-s * p),
                                    m = u(i * p),
                                    g = h.BASE.multiplyAndAddUnsafe(d, y, m);
                                if (!g) throw Error("point at infinify");
                                return g.assertValidity(), g
                            }
                            hasHighS() {
                                return this.s > n >> y
                            }
                            normalizeS() {
                                return this.hasHighS() ? new E(this.r, u(-this.s), this.recovery) : this
                            }
                            toDERRawBytes() {
                                return l.hexToBytes(this.toDERHex())
                            }
                            toDERHex() {
                                return d.hexFromSig({
                                    r: this.r,
                                    s: this.s
                                })
                            }
                            toCompactRawBytes() {
                                return l.hexToBytes(this.toCompactHex())
                            }
                            toCompactHex() {
                                return w(this.r) + w(this.s)
                            }
                        }

                        function x(t) {
                            let e = l._t(t),
                                r = "string" == typeof t,
                                n = (e || r) && t.length;
                            return e ? n === o || n === s : r ? n === 2 * o || n === 2 * s : t instanceof h
                        }
                        let M = e.bits2int || function(t) {
                                let r = l.bytesToNumberBE(t),
                                    n = 8 * t.length - e.nBitLength;
                                return n > 0 ? r >> BigInt(n) : r
                            },
                            _ = e.bits2int_modN || function(t) {
                                return u(M(t))
                            },
                            A = l.dQ(e.nBitLength);

                        function B(t) {
                            if ("bigint" != typeof t) throw Error("bigint expected");
                            if (!(p <= t && t < A)) throw Error(`bigint expected < 2^${e.nBitLength}`);
                            return l.tL(t, e.nByteLength)
                        }
                        let S = {
                                lowS: e.lowS,
                                prehash: !1
                            },
                            O = {
                                lowS: e.lowS,
                                prehash: !1
                            };
                        return h.BASE._setWindowSize(8), {
                            CURVE: e,
                            getPublicKey: function(t, e = !0) {
                                return h.fromPrivateKey(t).toRawBytes(e)
                            },
                            getSharedSecret: function(t, e, r = !0) {
                                if (x(t)) throw Error("first arg must be private key");
                                if (!x(e)) throw Error("second arg must be public key");
                                return h.fromHex(e).multiply(c(t)).toRawBytes(r)
                            },
                            sign: function(t, i, o = S) {
                                let {
                                    seed: s,
                                    k2sig: f
                                } = function(t, i, o = S) {
                                    if (["recovered", "canonical"].some(t => t in o)) throw Error("sign() legacy options not supported");
                                    let {
                                        hash: s,
                                        randomBytes: f
                                    } = e, {
                                        lowS: d,
                                        prehash: m,
                                        extraEntropy: g
                                    } = o;
                                    null == d && (d = !0), t = (0, l.ql)("msgHash", t), m && (t = (0, l.ql)("prehashed msgHash", s(t)));
                                    let w = _(t),
                                        b = c(i),
                                        x = [B(b), B(w)];
                                    if (null != g && !1 !== g) {
                                        let t = !0 === g ? f(r.BYTES) : g;
                                        x.push((0, l.ql)("extraEntropy", t))
                                    }
                                    return {
                                        seed: l.eV(...x),
                                        k2sig: function(t) {
                                            let e = M(t);
                                            if (!v(e)) return;
                                            let r = a(e),
                                                i = h.BASE.multiply(e).toAffine(),
                                                o = u(i.x);
                                            if (o === p) return;
                                            let s = u(r * u(w + o * b));
                                            if (s === p) return;
                                            let l = (i.x === o ? 0 : 2) | Number(i.y & y),
                                                f = s;
                                            if (d && s > n >> y) f = s > n >> y ? u(-s) : s, l ^= 1;
                                            return new E(o, f, l)
                                        }
                                    }
                                }(t, i, o);
                                return l.n$(e.hash.outputLen, e.nByteLength, e.hmac)(s, f)
                            },
                            verify: function(t, r, n, i = O) {
                                let o, s;
                                if (r = (0, l.ql)("msgHash", r), n = (0, l.ql)("publicKey", n), "strict" in i) throw Error("options.strict was renamed to lowS");
                                let {
                                    lowS: f,
                                    prehash: c
                                } = i;
                                try {
                                    if ("string" == typeof t || l._t(t)) try {
                                        s = E.fromDER(t)
                                    } catch (e) {
                                        if (!(e instanceof d.Err)) throw e;
                                        s = E.fromCompact(t)
                                    } else if ("object" == typeof t && "bigint" == typeof t.r && "bigint" == typeof t.s) {
                                        let {
                                            r: e,
                                            s: r
                                        } = t;
                                        s = new E(e, r)
                                    } else throw Error("PARSE");
                                    o = h.fromHex(n)
                                } catch (t) {
                                    if ("PARSE" === t.message) throw Error("signature must be Signature instance, Uint8Array or hex string");
                                    return !1
                                }
                                if (f && s.hasHighS()) return !1;
                                c && (r = e.hash(r));
                                let {
                                    r: p,
                                    s: y
                                } = s, m = _(r), g = a(y), v = u(m * g), w = u(p * g), b = h.BASE.multiplyAndAddUnsafe(o, v, w) ? .toAffine();
                                return !!b && u(b.x) === p
                            },
                            ProjectivePoint: h,
                            Signature: E,
                            utils: {
                                isValidPrivateKey(t) {
                                    try {
                                        return c(t), !0
                                    } catch (t) {
                                        return !1
                                    }
                                },
                                normPrivateKeyToScalar: c,
                                randomPrivateKey: () => {
                                    let t = i.PS(e.n);
                                    return i.Us(e.randomBytes(t), e.n)
                                },
                                precompute: (t = 8, e = h.BASE) => (e._setWindowSize(t), e.multiply(BigInt(3)), e)
                            }
                        }
                    })({ ...t,
                        hash: e,
                        hmac: (t, ...r) => a(e, t, (0, s.eV)(...r)),
                        randomBytes: s.O6
                    });
                    return Object.freeze({ ...r(e),
                        create: r
                    })
                }({
                    a: BigInt(0),
                    b: BigInt(7),
                    Fp: x,
                    n: v,
                    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
                    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
                    h: BigInt(1),
                    lowS: !0,
                    endo: {
                        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
                        splitScalar: t => {
                            let e = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
                                r = -w * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
                                n = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
                                o = BigInt("0x100000000000000000000000000000000"),
                                s = E(e * t, v),
                                u = E(-r * t, v),
                                a = (0, i.wQ)(t - s * e - u * n, v),
                                l = (0, i.wQ)(-s * r - u * e, v),
                                f = a > o,
                                h = l > o;
                            if (f && (a = v - a), h && (l = v - l), a > o || l > o) throw Error("splitScalar: Endomorphism failed, k=" + t);
                            return {
                                k1neg: f,
                                k1: a,
                                k2neg: h,
                                k2: l
                            }
                        }
                    }
                }, n.J);
            BigInt(0), M.ProjectivePoint
        },
        4374: function(t, e, r) {
            "use strict";

            function n(t) {
                if (!Number.isSafeInteger(t) || t < 0) throw Error(`positive integer expected, not ${t}`)
            }

            function i(t, ...e) {
                if (!(t instanceof Uint8Array || null != t && "object" == typeof t && "Uint8Array" === t.constructor.name)) throw Error("Uint8Array expected");
                if (e.length > 0 && !e.includes(t.length)) throw Error(`Uint8Array expected of length ${e}, not of length=${t.length}`)
            }

            function o(t) {
                if ("function" != typeof t || "function" != typeof t.create) throw Error("Hash should be wrapped by utils.wrapConstructor");
                n(t.outputLen), n(t.blockLen)
            }

            function s(t, e = !0) {
                if (t.destroyed) throw Error("Hash instance has been destroyed");
                if (e && t.finished) throw Error("Hash#digest() has already been called")
            }

            function u(t, e) {
                i(t);
                let r = e.outputLen;
                if (t.length < r) throw Error(`digestInto() expects output buffer of length at least ${r}`)
            }
            r.d(e, {
                Gg: function() {
                    return s
                },
                J8: function() {
                    return u
                },
                Rx: function() {
                    return n
                },
                aI: function() {
                    return i
                },
                vp: function() {
                    return o
                }
            })
        },
        717: function(t, e, r) {
            "use strict";
            r.d(e, {
                VR: function() {
                    return u
                },
                bc: function() {
                    return o
                },
                l3: function() {
                    return s
                }
            });
            var n = r(4374),
                i = r(1176);
            let o = (t, e, r) => t & e ^ ~t & r,
                s = (t, e, r) => t & e ^ t & r ^ e & r;
            class u extends i.kb {
                constructor(t, e, r, n) {
                    super(), this.blockLen = t, this.outputLen = e, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(t), this.view = (0, i.GL)(this.buffer)
                }
                update(t) {
                    (0, n.Gg)(this);
                    let {
                        view: e,
                        buffer: r,
                        blockLen: o
                    } = this, s = (t = (0, i.O0)(t)).length;
                    for (let n = 0; n < s;) {
                        let u = Math.min(o - this.pos, s - n);
                        if (u === o) {
                            let e = (0, i.GL)(t);
                            for (; o <= s - n; n += o) this.process(e, n);
                            continue
                        }
                        r.set(t.subarray(n, n + u), this.pos), this.pos += u, n += u, this.pos === o && (this.process(e, 0), this.pos = 0)
                    }
                    return this.length += t.length, this.roundClean(), this
                }
                digestInto(t) {
                    (0, n.Gg)(this), (0, n.J8)(t, this), this.finished = !0;
                    let {
                        buffer: e,
                        view: r,
                        blockLen: o,
                        isLE: s
                    } = this, {
                        pos: u
                    } = this;
                    e[u++] = 128, this.buffer.subarray(u).fill(0), this.padOffset > o - u && (this.process(r, 0), u = 0);
                    for (let t = u; t < o; t++) e[t] = 0;
                    ! function(t, e, r, n) {
                        if ("function" == typeof t.setBigUint64) return t.setBigUint64(e, r, n);
                        let i = BigInt(32),
                            o = BigInt(4294967295),
                            s = Number(r >> i & o),
                            u = Number(r & o),
                            a = n ? 4 : 0,
                            l = n ? 0 : 4;
                        t.setUint32(e + a, s, n), t.setUint32(e + l, u, n)
                    }(r, o - 8, BigInt(8 * this.length), s), this.process(r, 0);
                    let a = (0, i.GL)(t),
                        l = this.outputLen;
                    if (l % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
                    let f = l / 4,
                        h = this.get();
                    if (f > h.length) throw Error("_sha2: outputLen bigger than state");
                    for (let t = 0; t < f; t++) a.setUint32(4 * t, h[t], s)
                }
                digest() {
                    let {
                        buffer: t,
                        outputLen: e
                    } = this;
                    this.digestInto(t);
                    let r = t.slice(0, e);
                    return this.destroy(), r
                }
                _cloneInto(t) {
                    t || (t = new this.constructor), t.set(...this.get());
                    let {
                        blockLen: e,
                        buffer: r,
                        length: n,
                        finished: i,
                        destroyed: o,
                        pos: s
                    } = this;
                    return t.length = n, t.pos = s, t.finished = i, t.destroyed = o, n % e && t.buffer.set(r), t
                }
            }
        },
        4248: function(t, e, r) {
            "use strict";
            r.d(e, {
                EP: function() {
                    return u
                },
                SD: function() {
                    return l
                },
                Vl: function() {
                    return s
                },
                gm: function() {
                    return a
                },
                mk: function() {
                    return f
                }
            });
            let n = BigInt(4294967296 - 1),
                i = BigInt(32);

            function o(t, e = !1) {
                return e ? {
                    h: Number(t & n),
                    l: Number(t >> i & n)
                } : {
                    h: 0 | Number(t >> i & n),
                    l: 0 | Number(t & n)
                }
            }

            function s(t, e = !1) {
                let r = new Uint32Array(t.length),
                    n = new Uint32Array(t.length);
                for (let i = 0; i < t.length; i++) {
                    let {
                        h: s,
                        l: u
                    } = o(t[i], e);
                    [r[i], n[i]] = [s, u]
                }
                return [r, n]
            }
            let u = (t, e, r) => t << r | e >>> 32 - r,
                a = (t, e, r) => e << r | t >>> 32 - r,
                l = (t, e, r) => e << r - 32 | t >>> 64 - r,
                f = (t, e, r) => t << r - 32 | e >>> 64 - r;
            e.ZP = {
                fromBig: o,
                split: s,
                toBig: (t, e) => BigInt(t >>> 0) << i | BigInt(e >>> 0),
                shrSH: (t, e, r) => t >>> r,
                shrSL: (t, e, r) => t << 32 - r | e >>> r,
                rotrSH: (t, e, r) => t >>> r | e << 32 - r,
                rotrSL: (t, e, r) => t << 32 - r | e >>> r,
                rotrBH: (t, e, r) => t << 64 - r | e >>> r - 32,
                rotrBL: (t, e, r) => t >>> r - 32 | e << 64 - r,
                rotr32H: (t, e) => e,
                rotr32L: (t, e) => t,
                rotlSH: u,
                rotlSL: a,
                rotlBH: l,
                rotlBL: f,
                add: function(t, e, r, n) {
                    let i = (e >>> 0) + (n >>> 0);
                    return {
                        h: t + r + (i / 4294967296 | 0) | 0,
                        l: 0 | i
                    }
                },
                add3L: (t, e, r) => (t >>> 0) + (e >>> 0) + (r >>> 0),
                add3H: (t, e, r, n) => e + r + n + (t / 4294967296 | 0) | 0,
                add4L: (t, e, r, n) => (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0),
                add4H: (t, e, r, n, i) => e + r + n + i + (t / 4294967296 | 0) | 0,
                add5H: (t, e, r, n, i, o) => e + r + n + i + o + (t / 4294967296 | 0) | 0,
                add5L: (t, e, r, n, i) => (t >>> 0) + (e >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0)
            }
        },
        3940: function(t, e, r) {
            "use strict";
            r.d(e, {
                J: function() {
                    return l
                }
            });
            var n = r(717),
                i = r(1176);
            let o = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
                s = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
                u = new Uint32Array(64);
            class a extends n.VR {
                constructor() {
                    super(64, 32, 8, !1), this.A = 0 | s[0], this.B = 0 | s[1], this.C = 0 | s[2], this.D = 0 | s[3], this.E = 0 | s[4], this.F = 0 | s[5], this.G = 0 | s[6], this.H = 0 | s[7]
                }
                get() {
                    let {
                        A: t,
                        B: e,
                        C: r,
                        D: n,
                        E: i,
                        F: o,
                        G: s,
                        H: u
                    } = this;
                    return [t, e, r, n, i, o, s, u]
                }
                set(t, e, r, n, i, o, s, u) {
                    this.A = 0 | t, this.B = 0 | e, this.C = 0 | r, this.D = 0 | n, this.E = 0 | i, this.F = 0 | o, this.G = 0 | s, this.H = 0 | u
                }
                process(t, e) {
                    for (let r = 0; r < 16; r++, e += 4) u[r] = t.getUint32(e, !1);
                    for (let t = 16; t < 64; t++) {
                        let e = u[t - 15],
                            r = u[t - 2],
                            n = (0, i.np)(e, 7) ^ (0, i.np)(e, 18) ^ e >>> 3,
                            o = (0, i.np)(r, 17) ^ (0, i.np)(r, 19) ^ r >>> 10;
                        u[t] = o + u[t - 7] + n + u[t - 16] | 0
                    }
                    let {
                        A: r,
                        B: s,
                        C: a,
                        D: l,
                        E: f,
                        F: h,
                        G: c,
                        H: d
                    } = this;
                    for (let t = 0; t < 64; t++) {
                        let e = d + ((0, i.np)(f, 6) ^ (0, i.np)(f, 11) ^ (0, i.np)(f, 25)) + (0, n.bc)(f, h, c) + o[t] + u[t] | 0,
                            p = ((0, i.np)(r, 2) ^ (0, i.np)(r, 13) ^ (0, i.np)(r, 22)) + (0, n.l3)(r, s, a) | 0;
                        d = c, c = h, h = f, f = l + e | 0, l = a, a = s, s = r, r = e + p | 0
                    }
                    r = r + this.A | 0, s = s + this.B | 0, a = a + this.C | 0, l = l + this.D | 0, f = f + this.E | 0, h = h + this.F | 0, c = c + this.G | 0, d = d + this.H | 0, this.set(r, s, a, l, f, h, c, d)
                }
                roundClean() {
                    u.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0)
                }
            }
            let l = (0, i.hE)(() => new a)
        },
        9400: function(t, e, r) {
            "use strict";
            r.d(e, {
                fr: function() {
                    return b
                }
            });
            var n = r(4374),
                i = r(4248),
                o = r(1176);
            let s = [],
                u = [],
                a = [],
                l = BigInt(0),
                f = BigInt(1),
                h = BigInt(2),
                c = BigInt(7),
                d = BigInt(256),
                p = BigInt(113);
            for (let t = 0, e = f, r = 1, n = 0; t < 24; t++) {
                [r, n] = [n, (2 * r + 3 * n) % 5], s.push(2 * (5 * n + r)), u.push((t + 1) * (t + 2) / 2 % 64);
                let i = l;
                for (let t = 0; t < 7; t++)(e = (e << f ^ (e >> c) * p) % d) & h && (i ^= f << (f << BigInt(t)) - f);
                a.push(i)
            }
            let [y, m] = (0, i.Vl)(a, !0), g = (t, e, r) => r > 32 ? (0, i.SD)(t, e, r) : (0, i.EP)(t, e, r), v = (t, e, r) => r > 32 ? (0, i.mk)(t, e, r) : (0, i.gm)(t, e, r);
            class w extends o.kb {
                constructor(t, e, r, i = !1, s = 24) {
                    if (super(), this.blockLen = t, this.suffix = e, this.outputLen = r, this.enableXOF = i, this.rounds = s, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, (0, n.Rx)(r), 0 >= this.blockLen || this.blockLen >= 200) throw Error("Sha3 supports only keccak-f1600 function");
                    this.state = new Uint8Array(200), this.state32 = (0, o.Jq)(this.state)
                }
                keccak() {
                    o.iA || (0, o.l1)(this.state32),
                        function(t, e = 24) {
                            let r = new Uint32Array(10);
                            for (let n = 24 - e; n < 24; n++) {
                                for (let e = 0; e < 10; e++) r[e] = t[e] ^ t[e + 10] ^ t[e + 20] ^ t[e + 30] ^ t[e + 40];
                                for (let e = 0; e < 10; e += 2) {
                                    let n = (e + 8) % 10,
                                        i = (e + 2) % 10,
                                        o = r[i],
                                        s = r[i + 1],
                                        u = g(o, s, 1) ^ r[n],
                                        a = v(o, s, 1) ^ r[n + 1];
                                    for (let r = 0; r < 50; r += 10) t[e + r] ^= u, t[e + r + 1] ^= a
                                }
                                let e = t[2],
                                    i = t[3];
                                for (let r = 0; r < 24; r++) {
                                    let n = u[r],
                                        o = g(e, i, n),
                                        a = v(e, i, n),
                                        l = s[r];
                                    e = t[l], i = t[l + 1], t[l] = o, t[l + 1] = a
                                }
                                for (let e = 0; e < 50; e += 10) {
                                    for (let n = 0; n < 10; n++) r[n] = t[e + n];
                                    for (let n = 0; n < 10; n++) t[e + n] ^= ~r[(n + 2) % 10] & r[(n + 4) % 10]
                                }
                                t[0] ^= y[n], t[1] ^= m[n]
                            }
                            r.fill(0)
                        }(this.state32, this.rounds), o.iA || (0, o.l1)(this.state32), this.posOut = 0, this.pos = 0
                }
                update(t) {
                    (0, n.Gg)(this);
                    let {
                        blockLen: e,
                        state: r
                    } = this, i = (t = (0, o.O0)(t)).length;
                    for (let n = 0; n < i;) {
                        let o = Math.min(e - this.pos, i - n);
                        for (let e = 0; e < o; e++) r[this.pos++] ^= t[n++];
                        this.pos === e && this.keccak()
                    }
                    return this
                }
                finish() {
                    if (this.finished) return;
                    this.finished = !0;
                    let {
                        state: t,
                        suffix: e,
                        pos: r,
                        blockLen: n
                    } = this;
                    t[r] ^= e, (128 & e) != 0 && r === n - 1 && this.keccak(), t[n - 1] ^= 128, this.keccak()
                }
                writeInto(t) {
                    (0, n.Gg)(this, !1), (0, n.aI)(t), this.finish();
                    let e = this.state,
                        {
                            blockLen: r
                        } = this;
                    for (let n = 0, i = t.length; n < i;) {
                        this.posOut >= r && this.keccak();
                        let o = Math.min(r - this.posOut, i - n);
                        t.set(e.subarray(this.posOut, this.posOut + o), n), this.posOut += o, n += o
                    }
                    return t
                }
                xofInto(t) {
                    if (!this.enableXOF) throw Error("XOF is not possible for this instance");
                    return this.writeInto(t)
                }
                xof(t) {
                    return (0, n.Rx)(t), this.xofInto(new Uint8Array(t))
                }
                digestInto(t) {
                    if ((0, n.J8)(t, this), this.finished) throw Error("digest() was already called");
                    return this.writeInto(t), this.destroy(), t
                }
                digest() {
                    return this.digestInto(new Uint8Array(this.outputLen))
                }
                destroy() {
                    this.destroyed = !0, this.state.fill(0)
                }
                _cloneInto(t) {
                    let {
                        blockLen: e,
                        suffix: r,
                        outputLen: n,
                        rounds: i,
                        enableXOF: o
                    } = this;
                    return t || (t = new w(e, r, n, o, i)), t.state32.set(this.state32), t.pos = this.pos, t.posOut = this.posOut, t.finished = this.finished, t.rounds = i, t.suffix = r, t.outputLen = n, t.enableXOF = o, t.destroyed = this.destroyed, t
                }
            }
            let b = (0, o.hE)(() => new w(136, 1, 32))
        },
        1176: function(t, e, r) {
            "use strict";
            r.d(e, {
                kb: function() {
                    return p
                },
                l1: function() {
                    return f
                },
                eV: function() {
                    return d
                },
                GL: function() {
                    return s
                },
                iA: function() {
                    return a
                },
                O6: function() {
                    return m
                },
                np: function() {
                    return u
                },
                O0: function() {
                    return c
                },
                Jq: function() {
                    return o
                },
                iY: function() {
                    return h
                },
                hE: function() {
                    return y
                }
            });
            let n = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0;
            var i = r(4374);
            let o = t => new Uint32Array(t.buffer, t.byteOffset, Math.floor(t.byteLength / 4)),
                s = t => new DataView(t.buffer, t.byteOffset, t.byteLength),
                u = (t, e) => t << 32 - e | t >>> e,
                a = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0],
                l = t => t << 24 & 4278190080 | t << 8 & 16711680 | t >>> 8 & 65280 | t >>> 24 & 255;

            function f(t) {
                for (let e = 0; e < t.length; e++) t[e] = l(t[e])
            }

            function h(t) {
                if ("string" != typeof t) throw Error(`utf8ToBytes expected string, got ${typeof t}`);
                return new Uint8Array(new TextEncoder().encode(t))
            }

            function c(t) {
                return "string" == typeof t && (t = h(t)), (0, i.aI)(t), t
            }

            function d(...t) {
                let e = 0;
                for (let r = 0; r < t.length; r++) {
                    let n = t[r];
                    (0, i.aI)(n), e += n.length
                }
                let r = new Uint8Array(e);
                for (let e = 0, n = 0; e < t.length; e++) {
                    let i = t[e];
                    r.set(i, n), n += i.length
                }
                return r
            }
            class p {
                clone() {
                    return this._cloneInto()
                }
            }

            function y(t) {
                let e = e => t().update(c(e)).digest(),
                    r = t();
                return e.outputLen = r.outputLen, e.blockLen = r.blockLen, e.create = () => t(), e
            }

            function m(t = 32) {
                if (n && "function" == typeof n.getRandomValues) return n.getRandomValues(new Uint8Array(t));
                throw Error("crypto.getRandomValues must be defined")
            }
        },
        4583: function(t, e, r) {
            "use strict";
            r.d(e, {
                Z: function() {
                    return v
                }
            });
            var n, i, o = r(2265),
                s = r(9720);

            function u(t, e) {
                let r = Math.random() * (e - t + 1) + t;
                return Number.isInteger(t) && Number.isInteger(e) ? Math.floor(r) : r
            }

            function a(t) {
                return t ? {
                    height: t.offsetHeight,
                    width: t.offsetWidth
                } : {
                    height: 0,
                    width: 0
                }
            }
            let l = {
                color: "#dee4fd",
                radius: [.5, 3],
                speed: [1, 3],
                wind: [-.5, 2],
                changeFrequency: 200,
                rotationSpeed: [-1, 1]
            };
            class f {
                static createSnowflakes(t, e, r) {
                    if (!t) return [];
                    let n = [];
                    for (let i = 0; i < e; i++) n.push(new f(t, r));
                    return n
                }
                constructor(t, e = {}) {
                    this.updateConfig(e);
                    let {
                        radius: r,
                        wind: n,
                        speed: i,
                        rotationSpeed: o
                    } = this.config;
                    this.params = {
                        x: u(0, t.offsetWidth),
                        y: u(-t.offsetHeight, 0),
                        rotation: u(0, 360),
                        radius: u(...r),
                        speed: u(...i),
                        wind: u(...n),
                        rotationSpeed: u(...o),
                        nextSpeed: u(...n),
                        nextWind: u(...i),
                        nextRotationSpeed: u(...o)
                    }, this.framesSinceLastUpdate = 0
                }
                selectImage() {
                    this.config.images && this.config.images.length > 0 ? this.image = function(t) {
                        let e = Math.floor(Math.random() * t.length);
                        return t[e]
                    }(this.config.images) : this.image = void 0
                }
                updateConfig(t) {
                    let e = this.config;
                    this.config = Object.assign(Object.assign({}, l), t), this.config.changeFrequency = u(this.config.changeFrequency, 1.5 * this.config.changeFrequency), this.params && !s(this.config.radius, null == e ? void 0 : e.radius) && (this.params.radius = u(...this.config.radius)), s(this.config.images, null == e ? void 0 : e.images) || this.selectImage()
                }
                updateTargetParams() {
                    this.params.nextSpeed = u(...this.config.speed), this.params.nextWind = u(...this.config.wind), this.image && (this.params.nextRotationSpeed = u(...this.config.rotationSpeed))
                }
                update(t, e, r = 1) {
                    let {
                        x: n,
                        y: i,
                        rotation: o,
                        rotationSpeed: s,
                        nextRotationSpeed: u,
                        wind: a,
                        speed: l,
                        nextWind: f,
                        nextSpeed: h,
                        radius: c
                    } = this.params;
                    this.params.x = (n + a * r) % (t + 2 * c), this.params.x > t + c && (this.params.x = -c), this.params.y = (i + l * r) % (e + 2 * c), this.params.y > e + c && (this.params.y = -c), this.image && (this.params.rotation = (o + s) % 360), this.params.speed = .99 * l + .01 * h, this.params.wind = .99 * a + .01 * f, this.params.rotationSpeed = .99 * s + .01 * u, this.framesSinceLastUpdate++ > this.config.changeFrequency && (this.updateTargetParams(), this.framesSinceLastUpdate = 0)
                }
                getImageOffscreenCanvas(t, e) {
                    var r, n;
                    if (t instanceof HTMLImageElement && t.loading) return t;
                    let i = f.offscreenCanvases.get(t);
                    if (i || (i = {}, f.offscreenCanvases.set(t, i)), !(e in i)) {
                        let n = document.createElement("canvas");
                        n.width = e, n.height = e, null === (r = n.getContext("2d")) || void 0 === r || r.drawImage(t, 0, 0, e, e), i[e] = n
                    }
                    return null !== (n = i[e]) && void 0 !== n ? n : t
                }
                draw(t) {
                    let {
                        x: e,
                        y: r,
                        rotation: n,
                        radius: i
                    } = this.params;
                    if (this.image) {
                        let o = n * Math.PI / 180,
                            s = Math.cos(o),
                            u = Math.sin(o);
                        t.setTransform(s, u, -u, s, e, r);
                        let a = this.getImageOffscreenCanvas(this.image, i);
                        t.drawImage(a, -(i / 2), -(i / 2), i, i)
                    } else t.beginPath(), t.arc(e, r, i, 0, 2 * Math.PI), t.fillStyle = this.config.color, t.fill()
                }
            }
            f.offscreenCanvases = new WeakMap;
            let h = {
                    pointerEvents: "none",
                    backgroundColor: "transparent",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                },
                c = 1e3 / 60;
            var d = function(t, e, r, n) {
                    if ("a" === r && !n) throw TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof e ? t !== e || !n : !e.has(t)) throw TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === r ? n : "a" === r ? n.call(t) : n ? n.value : e.get(t)
                },
                p = function(t, e, r, n, i) {
                    if ("m" === n) throw TypeError("Private method is not writable");
                    if ("a" === n && !i) throw TypeError("Private accessor was defined without a setter");
                    if ("function" == typeof e ? t !== e || !i : !e.has(t)) throw TypeError("Cannot write private member to an object whose class did not declare it");
                    return "a" === n ? i.call(t, r) : i ? i.value = r : e.set(t, r), r
                };
            class y {
                get ctx() {
                    return d(this, n, "f")
                }
                get canvas() {
                    return d(this, i, "f")
                }
                set canvas(t) {
                    p(this, i, t, "f"), p(this, n, t.getContext("2d"), "f")
                }
                constructor(t, e) {
                    this.lastUpdate = Date.now(), this.snowflakes = [], n.set(this, void 0), i.set(this, void 0), p(this, i, t, "f"), p(this, n, t.getContext("2d"), "f"), this.config = Object.assign(Object.assign({
                        snowflakeCount: 150
                    }, l), e), this.snowflakes = [], this.snowflakes = f.createSnowflakes(t, e.snowflakeCount || 150, e), this.play()
                }
                updateConfig(t) {
                    this.config = Object.assign(Object.assign({}, this.config), t);
                    let e = this.config.snowflakeCount - this.snowflakes.length;
                    e > 0 && (this.snowflakes = [...this.snowflakes, ...f.createSnowflakes(this.canvas, e, t)]), e < 0 && (this.snowflakes = this.snowflakes.slice(0, this.config.snowflakeCount)), this.snowflakes.forEach(t => t.updateConfig(this.config))
                }
                render(t = 1) {
                    let {
                        ctx: e,
                        canvas: r,
                        snowflakes: n
                    } = this, {
                        offsetWidth: i,
                        offsetHeight: o
                    } = r;
                    n.forEach(e => e.update(i, o, t)), e && (e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, i, o), n.forEach(t => t.draw(e)))
                }
                loop() {
                    let t = Date.now(),
                        e = Date.now() - this.lastUpdate;
                    this.lastUpdate = t, this.render(e / c), this.animationFrame = requestAnimationFrame(() => this.loop())
                }
                play() {
                    this.loop()
                }
                pause() {
                    this.animationFrame && (cancelAnimationFrame(this.animationFrame), this.animationFrame = void 0)
                }
            }
            n = new WeakMap, i = new WeakMap;
            let m = t => {
                    let [e, r] = (0, o.useState)(a(t.current)), n = (0, o.useCallback)(() => {
                        t.current && r(a(t.current))
                    }, [t]);
                    return (0, o.useEffect)(() => {
                        let {
                            ResizeObserver: e
                        } = window;
                        if (t.current) {
                            if (n(), "function" != typeof e) return window.addEventListener("resize", n), () => window.removeEventListener("resize", n); {
                                let r = new e(n);
                                return r.observe(t.current), () => r.disconnect()
                            }
                        }
                    }, [t, n]), e
                },
                g = t => (0, o.useMemo)(() => Object.assign(Object.assign({}, h), t || {}), [t]);
            var v = ({
                color: t = l.color,
                changeFrequency: e = l.changeFrequency,
                radius: r = l.radius,
                speed: n = l.speed,
                wind: i = l.wind,
                rotationSpeed: u = l.rotationSpeed,
                snowflakeCount: a = 150,
                images: f,
                style: h
            } = {}) => {
                let c = g(h),
                    d = (0, o.useRef)(null),
                    p = m(d),
                    v = function(t) {
                        let [e, r] = (0, o.useState)(t);
                        return ! function(t, e) {
                            let r = (0, o.useRef)(e);
                            s(e, r.current) || (r.current = e), (0, o.useEffect)(t, r.current)
                        }(() => r(t), [t]), e
                    }({
                        color: t,
                        changeFrequency: e,
                        radius: r,
                        speed: n,
                        wind: i,
                        rotationSpeed: u,
                        images: f,
                        snowflakeCount: a
                    }),
                    w = (0, o.useRef)(v),
                    b = (0, o.useRef)();
                return (0, o.useEffect)(() => (!b.current && d.current && (b.current = new y(d.current, w.current)), () => {
                    var t;
                    null === (t = b.current) || void 0 === t || t.pause(), b.current = void 0
                }), []), (0, o.useEffect)(() => {
                    b.current && b.current.updateConfig(v)
                }, [v]), o.createElement("canvas", {
                    ref: d,
                    height: p.height,
                    width: p.width,
                    style: c,
                    "data-testid": "SnowfallCanvas"
                })
            }
        },
        3073: function(t, e, r) {
            "use strict";
            r.d(e, {
                u: function() {
                    return t_
                }
            });
            var n = r(2265);
            let i = Math.min,
                o = Math.max,
                s = Math.round,
                u = Math.floor,
                a = t => ({
                    x: t,
                    y: t
                }),
                l = {
                    left: "right",
                    right: "left",
                    bottom: "top",
                    top: "bottom"
                },
                f = {
                    start: "end",
                    end: "start"
                };

            function h(t, e) {
                return "function" == typeof t ? t(e) : t
            }

            function c(t) {
                return t.split("-")[0]
            }

            function d(t) {
                return t.split("-")[1]
            }

            function p(t) {
                return "x" === t ? "y" : "x"
            }

            function y(t) {
                return "y" === t ? "height" : "width"
            }

            function m(t) {
                return ["top", "bottom"].includes(c(t)) ? "y" : "x"
            }

            function g(t) {
                return t.replace(/start|end/g, t => f[t])
            }

            function v(t) {
                return t.replace(/left|right|bottom|top/g, t => l[t])
            }

            function w(t) {
                return "number" != typeof t ? {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    ...t
                } : {
                    top: t,
                    right: t,
                    bottom: t,
                    left: t
                }
            }

            function b(t) {
                return { ...t,
                    top: t.y,
                    left: t.x,
                    right: t.x + t.width,
                    bottom: t.y + t.height
                }
            }

            function E(t, e, r) {
                let n, {
                        reference: i,
                        floating: o
                    } = t,
                    s = m(e),
                    u = p(m(e)),
                    a = y(u),
                    l = c(e),
                    f = "y" === s,
                    h = i.x + i.width / 2 - o.width / 2,
                    g = i.y + i.height / 2 - o.height / 2,
                    v = i[a] / 2 - o[a] / 2;
                switch (l) {
                    case "top":
                        n = {
                            x: h,
                            y: i.y - o.height
                        };
                        break;
                    case "bottom":
                        n = {
                            x: h,
                            y: i.y + i.height
                        };
                        break;
                    case "right":
                        n = {
                            x: i.x + i.width,
                            y: g
                        };
                        break;
                    case "left":
                        n = {
                            x: i.x - o.width,
                            y: g
                        };
                        break;
                    default:
                        n = {
                            x: i.x,
                            y: i.y
                        }
                }
                switch (d(e)) {
                    case "start":
                        n[u] -= v * (r && f ? -1 : 1);
                        break;
                    case "end":
                        n[u] += v * (r && f ? -1 : 1)
                }
                return n
            }
            let x = async (t, e, r) => {
                let {
                    placement: n = "bottom",
                    strategy: i = "absolute",
                    middleware: o = [],
                    platform: s
                } = r, u = o.filter(Boolean), a = await (null == s.isRTL ? void 0 : s.isRTL(e)), l = await s.getElementRects({
                    reference: t,
                    floating: e,
                    strategy: i
                }), {
                    x: f,
                    y: h
                } = E(l, n, a), c = n, d = {}, p = 0;
                for (let r = 0; r < u.length; r++) {
                    let {
                        name: o,
                        fn: y
                    } = u[r], {
                        x: m,
                        y: g,
                        data: v,
                        reset: w
                    } = await y({
                        x: f,
                        y: h,
                        initialPlacement: n,
                        placement: c,
                        strategy: i,
                        middlewareData: d,
                        rects: l,
                        platform: s,
                        elements: {
                            reference: t,
                            floating: e
                        }
                    });
                    f = null != m ? m : f, h = null != g ? g : h, d = { ...d,
                        [o]: { ...d[o],
                            ...v
                        }
                    }, w && p <= 50 && (p++, "object" == typeof w && (w.placement && (c = w.placement), w.rects && (l = !0 === w.rects ? await s.getElementRects({
                        reference: t,
                        floating: e,
                        strategy: i
                    }) : w.rects), {
                        x: f,
                        y: h
                    } = E(l, c, a)), r = -1)
                }
                return {
                    x: f,
                    y: h,
                    placement: c,
                    strategy: i,
                    middlewareData: d
                }
            };
            async function M(t, e) {
                var r;
                void 0 === e && (e = {});
                let {
                    x: n,
                    y: i,
                    platform: o,
                    rects: s,
                    elements: u,
                    strategy: a
                } = t, {
                    boundary: l = "clippingAncestors",
                    rootBoundary: f = "viewport",
                    elementContext: c = "floating",
                    altBoundary: d = !1,
                    padding: p = 0
                } = h(e, t), y = w(p), m = u[d ? "floating" === c ? "reference" : "floating" : c], g = b(await o.getClippingRect({
                    element: null == (r = await (null == o.isElement ? void 0 : o.isElement(m))) || r ? m : m.contextElement || await (null == o.getDocumentElement ? void 0 : o.getDocumentElement(u.floating)),
                    boundary: l,
                    rootBoundary: f,
                    strategy: a
                })), v = "floating" === c ? { ...s.floating,
                    x: n,
                    y: i
                } : s.reference, E = await (null == o.getOffsetParent ? void 0 : o.getOffsetParent(u.floating)), x = await (null == o.isElement ? void 0 : o.isElement(E)) && await (null == o.getScale ? void 0 : o.getScale(E)) || {
                    x: 1,
                    y: 1
                }, M = b(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
                    elements: u,
                    rect: v,
                    offsetParent: E,
                    strategy: a
                }) : v);
                return {
                    top: (g.top - M.top + y.top) / x.y,
                    bottom: (M.bottom - g.bottom + y.bottom) / x.y,
                    left: (g.left - M.left + y.left) / x.x,
                    right: (M.right - g.right + y.right) / x.x
                }
            }
            async function _(t, e) {
                let {
                    placement: r,
                    platform: n,
                    elements: i
                } = t, o = await (null == n.isRTL ? void 0 : n.isRTL(i.floating)), s = c(r), u = d(r), a = "y" === m(r), l = ["left", "top"].includes(s) ? -1 : 1, f = o && a ? -1 : 1, p = h(e, t), {
                    mainAxis: y,
                    crossAxis: g,
                    alignmentAxis: v
                } = "number" == typeof p ? {
                    mainAxis: p,
                    crossAxis: 0,
                    alignmentAxis: null
                } : {
                    mainAxis: 0,
                    crossAxis: 0,
                    alignmentAxis: null,
                    ...p
                };
                return u && "number" == typeof v && (g = "end" === u ? -1 * v : v), a ? {
                    x: g * f,
                    y: y * l
                } : {
                    x: y * l,
                    y: g * f
                }
            }
            let A = function(t) {
                return void 0 === t && (t = 0), {
                    name: "offset",
                    options: t,
                    async fn(e) {
                        var r, n;
                        let {
                            x: i,
                            y: o,
                            placement: s,
                            middlewareData: u
                        } = e, a = await _(e, t);
                        return s === (null == (r = u.offset) ? void 0 : r.placement) && null != (n = u.arrow) && n.alignmentOffset ? {} : {
                            x: i + a.x,
                            y: o + a.y,
                            data: { ...a,
                                placement: s
                            }
                        }
                    }
                }
            };

            function B(t) {
                return I(t) ? (t.nodeName || "").toLowerCase() : "#document"
            }

            function S(t) {
                var e;
                return (null == t || null == (e = t.ownerDocument) ? void 0 : e.defaultView) || window
            }

            function O(t) {
                var e;
                return null == (e = (I(t) ? t.ownerDocument : t.document) || window.document) ? void 0 : e.documentElement
            }

            function I(t) {
                return t instanceof Node || t instanceof S(t).Node
            }

            function k(t) {
                return t instanceof Element || t instanceof S(t).Element
            }

            function L(t) {
                return t instanceof HTMLElement || t instanceof S(t).HTMLElement
            }

            function R(t) {
                return "undefined" != typeof ShadowRoot && (t instanceof ShadowRoot || t instanceof S(t).ShadowRoot)
            }

            function T(t) {
                let {
                    overflow: e,
                    overflowX: r,
                    overflowY: n,
                    display: i
                } = N(t);
                return /auto|scroll|overlay|hidden|clip/.test(e + n + r) && !["inline", "contents"].includes(i)
            }

            function U(t) {
                let e = P(),
                    r = N(t);
                return "none" !== r.transform || "none" !== r.perspective || !!r.containerType && "normal" !== r.containerType || !e && !!r.backdropFilter && "none" !== r.backdropFilter || !e && !!r.filter && "none" !== r.filter || ["transform", "perspective", "filter"].some(t => (r.willChange || "").includes(t)) || ["paint", "layout", "strict", "content"].some(t => (r.contain || "").includes(t))
            }

            function P() {
                return "undefined" != typeof CSS && !!CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")
            }

            function C(t) {
                return ["html", "body", "#document"].includes(B(t))
            }

            function N(t) {
                return S(t).getComputedStyle(t)
            }

            function j(t) {
                return k(t) ? {
                    scrollLeft: t.scrollLeft,
                    scrollTop: t.scrollTop
                } : {
                    scrollLeft: t.pageXOffset,
                    scrollTop: t.pageYOffset
                }
            }

            function q(t) {
                if ("html" === B(t)) return t;
                let e = t.assignedSlot || t.parentNode || R(t) && t.host || O(t);
                return R(e) ? e.host : e
            }

            function F(t, e, r) {
                var n;
                void 0 === e && (e = []), void 0 === r && (r = !0);
                let i = function t(e) {
                        let r = q(e);
                        return C(r) ? e.ownerDocument ? e.ownerDocument.body : e.body : L(r) && T(r) ? r : t(r)
                    }(t),
                    o = i === (null == (n = t.ownerDocument) ? void 0 : n.body),
                    s = S(i);
                return o ? e.concat(s, s.visualViewport || [], T(i) ? i : [], s.frameElement && r ? F(s.frameElement) : []) : e.concat(i, F(i, [], r))
            }

            function z(t) {
                let e = N(t),
                    r = parseFloat(e.width) || 0,
                    n = parseFloat(e.height) || 0,
                    i = L(t),
                    o = i ? t.offsetWidth : r,
                    u = i ? t.offsetHeight : n,
                    a = s(r) !== o || s(n) !== u;
                return a && (r = o, n = u), {
                    width: r,
                    height: n,
                    $: a
                }
            }

            function $(t) {
                return k(t) ? t : t.contextElement
            }

            function D(t) {
                let e = $(t);
                if (!L(e)) return a(1);
                let r = e.getBoundingClientRect(),
                    {
                        width: n,
                        height: i,
                        $: o
                    } = z(e),
                    u = (o ? s(r.width) : r.width) / n,
                    l = (o ? s(r.height) : r.height) / i;
                return u && Number.isFinite(u) || (u = 1), l && Number.isFinite(l) || (l = 1), {
                    x: u,
                    y: l
                }
            }
            let Z = a(0);

            function H(t) {
                let e = S(t);
                return P() && e.visualViewport ? {
                    x: e.visualViewport.offsetLeft,
                    y: e.visualViewport.offsetTop
                } : Z
            }

            function V(t, e, r, n) {
                var i;
                void 0 === e && (e = !1), void 0 === r && (r = !1);
                let o = t.getBoundingClientRect(),
                    s = $(t),
                    u = a(1);
                e && (n ? k(n) && (u = D(n)) : u = D(t));
                let l = (void 0 === (i = r) && (i = !1), n && (!i || n === S(s)) && i) ? H(s) : a(0),
                    f = (o.left + l.x) / u.x,
                    h = (o.top + l.y) / u.y,
                    c = o.width / u.x,
                    d = o.height / u.y;
                if (s) {
                    let t = S(s),
                        e = n && k(n) ? S(n) : n,
                        r = t,
                        i = r.frameElement;
                    for (; i && n && e !== r;) {
                        let t = D(i),
                            e = i.getBoundingClientRect(),
                            n = N(i),
                            o = e.left + (i.clientLeft + parseFloat(n.paddingLeft)) * t.x,
                            s = e.top + (i.clientTop + parseFloat(n.paddingTop)) * t.y;
                        f *= t.x, h *= t.y, c *= t.x, d *= t.y, f += o, h += s, i = (r = S(i)).frameElement
                    }
                }
                return b({
                    width: c,
                    height: d,
                    x: f,
                    y: h
                })
            }
            let G = [":popover-open", ":modal"];

            function W(t) {
                return G.some(e => {
                    try {
                        return t.matches(e)
                    } catch (t) {
                        return !1
                    }
                })
            }

            function K(t) {
                return V(O(t)).left + j(t).scrollLeft
            }

            function Y(t, e, r) {
                let n;
                if ("viewport" === e) n = function(t, e) {
                    let r = S(t),
                        n = O(t),
                        i = r.visualViewport,
                        o = n.clientWidth,
                        s = n.clientHeight,
                        u = 0,
                        a = 0;
                    if (i) {
                        o = i.width, s = i.height;
                        let t = P();
                        (!t || t && "fixed" === e) && (u = i.offsetLeft, a = i.offsetTop)
                    }
                    return {
                        width: o,
                        height: s,
                        x: u,
                        y: a
                    }
                }(t, r);
                else if ("document" === e) n = function(t) {
                    let e = O(t),
                        r = j(t),
                        n = t.ownerDocument.body,
                        i = o(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth),
                        s = o(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight),
                        u = -r.scrollLeft + K(t),
                        a = -r.scrollTop;
                    return "rtl" === N(n).direction && (u += o(e.clientWidth, n.clientWidth) - i), {
                        width: i,
                        height: s,
                        x: u,
                        y: a
                    }
                }(O(t));
                else if (k(e)) n = function(t, e) {
                    let r = V(t, !0, "fixed" === e),
                        n = r.top + t.clientTop,
                        i = r.left + t.clientLeft,
                        o = L(t) ? D(t) : a(1),
                        s = t.clientWidth * o.x;
                    return {
                        width: s,
                        height: t.clientHeight * o.y,
                        x: i * o.x,
                        y: n * o.y
                    }
                }(e, r);
                else {
                    let r = H(t);
                    n = { ...e,
                        x: e.x - r.x,
                        y: e.y - r.y
                    }
                }
                return b(n)
            }

            function Q(t, e) {
                return L(t) && "fixed" !== N(t).position ? e ? e(t) : t.offsetParent : null
            }

            function J(t, e) {
                let r = S(t);
                if (!L(t) || W(t)) return r;
                let n = Q(t, e);
                for (; n && ["table", "td", "th"].includes(B(n)) && "static" === N(n).position;) n = Q(n, e);
                return n && ("html" === B(n) || "body" === B(n) && "static" === N(n).position && !U(n)) ? r : n || function(t) {
                    let e = q(t);
                    for (; L(e) && !C(e);) {
                        if (U(e)) return e;
                        e = q(e)
                    }
                    return null
                }(t) || r
            }
            let X = async function(t) {
                    let e = this.getOffsetParent || J,
                        r = this.getDimensions;
                    return {
                        reference: function(t, e, r) {
                            let n = L(e),
                                i = O(e),
                                o = "fixed" === r,
                                s = V(t, !0, o, e),
                                u = {
                                    scrollLeft: 0,
                                    scrollTop: 0
                                },
                                l = a(0);
                            if (n || !n && !o) {
                                if (("body" !== B(e) || T(i)) && (u = j(e)), n) {
                                    let t = V(e, !0, o, e);
                                    l.x = t.x + e.clientLeft, l.y = t.y + e.clientTop
                                } else i && (l.x = K(i))
                            }
                            return {
                                x: s.left + u.scrollLeft - l.x,
                                y: s.top + u.scrollTop - l.y,
                                width: s.width,
                                height: s.height
                            }
                        }(t.reference, await e(t.floating), t.strategy),
                        floating: {
                            x: 0,
                            y: 0,
                            ...await r(t.floating)
                        }
                    }
                },
                tt = {
                    convertOffsetParentRelativeRectToViewportRelativeRect: function(t) {
                        let {
                            elements: e,
                            rect: r,
                            offsetParent: n,
                            strategy: i
                        } = t, o = "fixed" === i, s = O(n), u = !!e && W(e.floating);
                        if (n === s || u && o) return r;
                        let l = {
                                scrollLeft: 0,
                                scrollTop: 0
                            },
                            f = a(1),
                            h = a(0),
                            c = L(n);
                        if ((c || !c && !o) && (("body" !== B(n) || T(s)) && (l = j(n)), L(n))) {
                            let t = V(n);
                            f = D(n), h.x = t.x + n.clientLeft, h.y = t.y + n.clientTop
                        }
                        return {
                            width: r.width * f.x,
                            height: r.height * f.y,
                            x: r.x * f.x - l.scrollLeft * f.x + h.x,
                            y: r.y * f.y - l.scrollTop * f.y + h.y
                        }
                    },
                    getDocumentElement: O,
                    getClippingRect: function(t) {
                        let {
                            element: e,
                            boundary: r,
                            rootBoundary: n,
                            strategy: s
                        } = t, u = [..."clippingAncestors" === r ? function(t, e) {
                            let r = e.get(t);
                            if (r) return r;
                            let n = F(t, [], !1).filter(t => k(t) && "body" !== B(t)),
                                i = null,
                                o = "fixed" === N(t).position,
                                s = o ? q(t) : t;
                            for (; k(s) && !C(s);) {
                                let e = N(s),
                                    r = U(s);
                                r || "fixed" !== e.position || (i = null), (o ? !r && !i : !r && "static" === e.position && !!i && ["absolute", "fixed"].includes(i.position) || T(s) && !r && function t(e, r) {
                                    let n = q(e);
                                    return !(n === r || !k(n) || C(n)) && ("fixed" === N(n).position || t(n, r))
                                }(t, s)) ? n = n.filter(t => t !== s) : i = e, s = q(s)
                            }
                            return e.set(t, n), n
                        }(e, this._c) : [].concat(r), n], a = u[0], l = u.reduce((t, r) => {
                            let n = Y(e, r, s);
                            return t.top = o(n.top, t.top), t.right = i(n.right, t.right), t.bottom = i(n.bottom, t.bottom), t.left = o(n.left, t.left), t
                        }, Y(e, a, s));
                        return {
                            width: l.right - l.left,
                            height: l.bottom - l.top,
                            x: l.left,
                            y: l.top
                        }
                    },
                    getOffsetParent: J,
                    getElementRects: X,
                    getClientRects: function(t) {
                        return Array.from(t.getClientRects())
                    },
                    getDimensions: function(t) {
                        let {
                            width: e,
                            height: r
                        } = z(t);
                        return {
                            width: e,
                            height: r
                        }
                    },
                    getScale: D,
                    isElement: k,
                    isRTL: function(t) {
                        return "rtl" === N(t).direction
                    }
                },
                te = function(t) {
                    return void 0 === t && (t = {}), {
                        name: "shift",
                        options: t,
                        async fn(e) {
                            let {
                                x: r,
                                y: n,
                                placement: s
                            } = e, {
                                mainAxis: u = !0,
                                crossAxis: a = !1,
                                limiter: l = {
                                    fn: t => {
                                        let {
                                            x: e,
                                            y: r
                                        } = t;
                                        return {
                                            x: e,
                                            y: r
                                        }
                                    }
                                },
                                ...f
                            } = h(t, e), d = {
                                x: r,
                                y: n
                            }, y = await M(e, f), g = m(c(s)), v = p(g), w = d[v], b = d[g];
                            if (u) {
                                let t = "y" === v ? "top" : "left",
                                    e = "y" === v ? "bottom" : "right",
                                    r = w + y[t],
                                    n = w - y[e];
                                w = o(r, i(w, n))
                            }
                            if (a) {
                                let t = "y" === g ? "top" : "left",
                                    e = "y" === g ? "bottom" : "right",
                                    r = b + y[t],
                                    n = b - y[e];
                                b = o(r, i(b, n))
                            }
                            let E = l.fn({ ...e,
                                [v]: w,
                                [g]: b
                            });
                            return { ...E,
                                data: {
                                    x: E.x - r,
                                    y: E.y - n
                                }
                            }
                        }
                    }
                },
                tr = function(t) {
                    return void 0 === t && (t = {}), {
                        name: "flip",
                        options: t,
                        async fn(e) {
                            var r, n, i, o, s;
                            let {
                                placement: u,
                                middlewareData: a,
                                rects: l,
                                initialPlacement: f,
                                platform: w,
                                elements: b
                            } = e, {
                                mainAxis: E = !0,
                                crossAxis: x = !0,
                                fallbackPlacements: _,
                                fallbackStrategy: A = "bestFit",
                                fallbackAxisSideDirection: B = "none",
                                flipAlignment: S = !0,
                                ...O
                            } = h(t, e);
                            if (null != (r = a.arrow) && r.alignmentOffset) return {};
                            let I = c(u),
                                k = c(f) === f,
                                L = await (null == w.isRTL ? void 0 : w.isRTL(b.floating)),
                                R = _ || (k || !S ? [v(f)] : function(t) {
                                    let e = v(t);
                                    return [g(t), e, g(e)]
                                }(f));
                            _ || "none" === B || R.push(... function(t, e, r, n) {
                                let i = d(t),
                                    o = function(t, e, r) {
                                        let n = ["left", "right"],
                                            i = ["right", "left"];
                                        switch (t) {
                                            case "top":
                                            case "bottom":
                                                if (r) return e ? i : n;
                                                return e ? n : i;
                                            case "left":
                                            case "right":
                                                return e ? ["top", "bottom"] : ["bottom", "top"];
                                            default:
                                                return []
                                        }
                                    }(c(t), "start" === r, n);
                                return i && (o = o.map(t => t + "-" + i), e && (o = o.concat(o.map(g)))), o
                            }(f, S, B, L));
                            let T = [f, ...R],
                                U = await M(e, O),
                                P = [],
                                C = (null == (n = a.flip) ? void 0 : n.overflows) || [];
                            if (E && P.push(U[I]), x) {
                                let t = function(t, e, r) {
                                    void 0 === r && (r = !1);
                                    let n = d(t),
                                        i = p(m(t)),
                                        o = y(i),
                                        s = "x" === i ? n === (r ? "end" : "start") ? "right" : "left" : "start" === n ? "bottom" : "top";
                                    return e.reference[o] > e.floating[o] && (s = v(s)), [s, v(s)]
                                }(u, l, L);
                                P.push(U[t[0]], U[t[1]])
                            }
                            if (C = [...C, {
                                    placement: u,
                                    overflows: P
                                }], !P.every(t => t <= 0)) {
                                let t = ((null == (i = a.flip) ? void 0 : i.index) || 0) + 1,
                                    e = T[t];
                                if (e) return {
                                    data: {
                                        index: t,
                                        overflows: C
                                    },
                                    reset: {
                                        placement: e
                                    }
                                };
                                let r = null == (o = C.filter(t => t.overflows[0] <= 0).sort((t, e) => t.overflows[1] - e.overflows[1])[0]) ? void 0 : o.placement;
                                if (!r) switch (A) {
                                    case "bestFit":
                                        {
                                            let t = null == (s = C.map(t => [t.placement, t.overflows.filter(t => t > 0).reduce((t, e) => t + e, 0)]).sort((t, e) => t[1] - e[1])[0]) ? void 0 : s[0];t && (r = t);
                                            break
                                        }
                                    case "initialPlacement":
                                        r = f
                                }
                                if (u !== r) return {
                                    reset: {
                                        placement: r
                                    }
                                }
                            }
                            return {}
                        }
                    }
                },
                tn = t => ({
                    name: "arrow",
                    options: t,
                    async fn(e) {
                        let {
                            x: r,
                            y: n,
                            placement: s,
                            rects: u,
                            platform: a,
                            elements: l,
                            middlewareData: f
                        } = e, {
                            element: c,
                            padding: g = 0
                        } = h(t, e) || {};
                        if (null == c) return {};
                        let v = w(g),
                            b = {
                                x: r,
                                y: n
                            },
                            E = p(m(s)),
                            x = y(E),
                            M = await a.getDimensions(c),
                            _ = "y" === E,
                            A = _ ? "clientHeight" : "clientWidth",
                            B = u.reference[x] + u.reference[E] - b[E] - u.floating[x],
                            S = b[E] - u.reference[E],
                            O = await (null == a.getOffsetParent ? void 0 : a.getOffsetParent(c)),
                            I = O ? O[A] : 0;
                        I && await (null == a.isElement ? void 0 : a.isElement(O)) || (I = l.floating[A] || u.floating[x]);
                        let k = I / 2 - M[x] / 2 - 1,
                            L = i(v[_ ? "top" : "left"], k),
                            R = i(v[_ ? "bottom" : "right"], k),
                            T = I - M[x] - R,
                            U = I / 2 - M[x] / 2 + (B / 2 - S / 2),
                            P = o(L, i(U, T)),
                            C = !f.arrow && null != d(s) && U !== P && u.reference[x] / 2 - (U < L ? L : R) - M[x] / 2 < 0,
                            N = C ? U < L ? U - L : U - T : 0;
                        return {
                            [E]: b[E] + N,
                            data: {
                                [E]: P,
                                centerOffset: U - P - N,
                                ...C && {
                                    alignmentOffset: N
                                }
                            },
                            reset: C
                        }
                    }
                }),
                ti = (t, e, r) => {
                    let n = new Map,
                        i = {
                            platform: tt,
                            ...r
                        },
                        o = { ...i.platform,
                            _c: n
                        };
                    return x(t, e, { ...i,
                        platform: o
                    })
                };
            var to = r(6480),
                ts = r(9079);
            /*
             * React Tooltip
             * {@link https://github.com/ReactTooltip/react-tooltip}
             * @copyright ReactTooltip Team
             * @license MIT
             */
            let tu = {
                core: !1,
                base: !1
            };

            function ta({
                css: t,
                id: e = "react-tooltip-base-styles",
                type: r = "base",
                ref: n
            }) {
                var i, o;
                if (!t || "undefined" == typeof document || tu[r] || "core" === r && void 0 !== ts && (null === (i = null == ts ? void 0 : ts.env) || void 0 === i ? void 0 : i.REACT_TOOLTIP_DISABLE_CORE_STYLES) || "base" !== r && void 0 !== ts && (null === (o = null == ts ? void 0 : ts.env) || void 0 === o ? void 0 : o.REACT_TOOLTIP_DISABLE_BASE_STYLES)) return;
                "core" === r && (e = "react-tooltip-core-styles"), n || (n = {});
                let {
                    insertAt: s
                } = n;
                if (document.getElementById(e)) return void console.warn(`[react-tooltip] Element with id '${e}' already exists. Call \`removeStyle()\` first`);
                let u = document.head || document.getElementsByTagName("head")[0],
                    a = document.createElement("style");
                a.id = e, a.type = "text/css", "top" === s && u.firstChild ? u.insertBefore(a, u.firstChild) : u.appendChild(a), a.styleSheet ? a.styleSheet.cssText = t : a.appendChild(document.createTextNode(t)), tu[r] = !0
            }
            let tl = async ({
                    elementReference: t = null,
                    tooltipReference: e = null,
                    tooltipArrowReference: r = null,
                    place: n = "top",
                    offset: i = 10,
                    strategy: o = "absolute",
                    middlewares: s = [A(Number(i)), tr({
                        fallbackAxisSideDirection: "start"
                    }), te({
                        padding: 5
                    })],
                    border: u
                }) => t && null !== e ? r ? (s.push(tn({
                    element: r,
                    padding: 5
                })), ti(t, e, {
                    placement: n,
                    strategy: o,
                    middleware: s
                }).then(({
                    x: t,
                    y: e,
                    placement: r,
                    middlewareData: n
                }) => {
                    var i, o;
                    let s = {
                            left: `${t}px`,
                            top: `${e}px`,
                            border: u
                        },
                        {
                            x: a,
                            y: l
                        } = null !== (i = n.arrow) && void 0 !== i ? i : {
                            x: 0,
                            y: 0
                        },
                        f = null !== (o = ({
                            top: "bottom",
                            right: "left",
                            bottom: "top",
                            left: "right"
                        })[r.split("-")[0]]) && void 0 !== o ? o : "bottom",
                        h = 0;
                    if (u) {
                        let t = `${u}`.match(/(\d+)px/);
                        h = (null == t ? void 0 : t[1]) ? Number(t[1]) : 1
                    }
                    return {
                        tooltipStyles: s,
                        tooltipArrowStyles: {
                            left: null != a ? `${a}px` : "",
                            top: null != l ? `${l}px` : "",
                            right: "",
                            bottom: "",
                            ...u && {
                                borderBottom: u,
                                borderRight: u
                            },
                            [f]: `-${4+h}px`
                        },
                        place: r
                    }
                })) : ti(t, e, {
                    placement: "bottom",
                    strategy: o,
                    middleware: s
                }).then(({
                    x: t,
                    y: e,
                    placement: r
                }) => ({
                    tooltipStyles: {
                        left: `${t}px`,
                        top: `${e}px`
                    },
                    tooltipArrowStyles: {},
                    place: r
                })) : {
                    tooltipStyles: {},
                    tooltipArrowStyles: {},
                    place: n
                },
                tf = (t, e) => !("CSS" in window && "supports" in window.CSS) || window.CSS.supports(t, e),
                th = (t, e, r) => {
                    let n = null,
                        i = function(...i) {
                            let o = () => {
                                n = null, r || t.apply(this, i)
                            };
                            r && !n && (t.apply(this, i), n = setTimeout(o, e)), r || (n && clearTimeout(n), n = setTimeout(o, e))
                        };
                    return i.cancel = () => {
                        n && (clearTimeout(n), n = null)
                    }, i
                },
                tc = t => null !== t && !Array.isArray(t) && "object" == typeof t,
                td = (t, e) => {
                    if (t === e) return !0;
                    if (Array.isArray(t) && Array.isArray(e)) return t.length === e.length && t.every((t, r) => td(t, e[r]));
                    if (Array.isArray(t) !== Array.isArray(e)) return !1;
                    if (!tc(t) || !tc(e)) return t === e;
                    let r = Object.keys(t),
                        n = Object.keys(e);
                    return r.length === n.length && r.every(r => td(t[r], e[r]))
                },
                tp = t => {
                    if (!(t instanceof HTMLElement || t instanceof SVGElement)) return !1;
                    let e = getComputedStyle(t);
                    return ["overflow", "overflow-x", "overflow-y"].some(t => {
                        let r = e.getPropertyValue(t);
                        return "auto" === r || "scroll" === r
                    })
                },
                ty = t => {
                    if (!t) return null;
                    let e = t.parentElement;
                    for (; e;) {
                        if (tp(e)) return e;
                        e = e.parentElement
                    }
                    return document.scrollingElement || document.documentElement
                },
                tm = "undefined" != typeof window ? n.useLayoutEffect : n.useEffect,
                tg = {
                    anchorRefs: new Set,
                    activeAnchor: {
                        current: null
                    },
                    attach: () => {},
                    detach: () => {},
                    setActiveAnchor: () => {}
                },
                tv = (0, n.createContext)({
                    getTooltipData: () => tg
                });

            function tw(t = "DEFAULT_TOOLTIP_ID") {
                return (0, n.useContext)(tv).getTooltipData(t)
            }
            var tb = {
                    tooltip: "core-styles-module_tooltip__3vRRp",
                    fixed: "core-styles-module_fixed__pcSol",
                    arrow: "core-styles-module_arrow__cvMwQ",
                    noArrow: "core-styles-module_noArrow__xock6",
                    clickable: "core-styles-module_clickable__ZuTTB",
                    show: "core-styles-module_show__Nt9eE",
                    closing: "core-styles-module_closing__sGnxF"
                },
                tE = {
                    tooltip: "styles-module_tooltip__mnnfp",
                    arrow: "styles-module_arrow__K0L3T",
                    dark: "styles-module_dark__xNqje",
                    light: "styles-module_light__Z6W-X",
                    success: "styles-module_success__A2AKt",
                    warning: "styles-module_warning__SCK0X",
                    error: "styles-module_error__JvumD",
                    info: "styles-module_info__BWdHW"
                };
            let tx = ({
                    forwardRef: t,
                    id: e,
                    className: r,
                    classNameArrow: s,
                    variant: a = "dark",
                    anchorId: l,
                    anchorSelect: f,
                    place: h = "top",
                    offset: c = 10,
                    events: d = ["hover"],
                    openOnClick: p = !1,
                    positionStrategy: y = "absolute",
                    middlewares: m,
                    wrapper: g,
                    delayShow: v = 0,
                    delayHide: w = 0,
                    float: b = !1,
                    hidden: E = !1,
                    noArrow: x = !1,
                    clickable: M = !1,
                    closeOnEsc: _ = !1,
                    closeOnScroll: A = !1,
                    closeOnResize: B = !1,
                    openEvents: S,
                    closeEvents: I,
                    globalCloseEvents: k,
                    imperativeModeOnly: L,
                    style: R,
                    position: T,
                    afterShow: U,
                    afterHide: P,
                    content: C,
                    contentWrapperRef: N,
                    isOpen: j,
                    defaultIsOpen: q = !1,
                    setIsOpen: z,
                    activeAnchor: D,
                    setActiveAnchor: Z,
                    border: H,
                    opacity: G,
                    arrowColor: W,
                    role: K = "tooltip"
                }) => {
                    var Y;
                    let Q = (0, n.useRef)(null),
                        J = (0, n.useRef)(null),
                        X = (0, n.useRef)(null),
                        tt = (0, n.useRef)(null),
                        te = (0, n.useRef)(null),
                        [tr, tn] = (0, n.useState)({
                            tooltipStyles: {},
                            tooltipArrowStyles: {},
                            place: h
                        }),
                        [ti, ts] = (0, n.useState)(!1),
                        [tu, ta] = (0, n.useState)(!1),
                        [tf, tc] = (0, n.useState)(null),
                        tp = (0, n.useRef)(!1),
                        tg = (0, n.useRef)(null),
                        {
                            anchorRefs: tv,
                            setActiveAnchor: tx
                        } = tw(e),
                        tM = (0, n.useRef)(!1),
                        [t_, tA] = (0, n.useState)([]),
                        tB = (0, n.useRef)(!1),
                        tS = p || d.includes("click"),
                        tO = tS || (null == S ? void 0 : S.click) || (null == S ? void 0 : S.dblclick) || (null == S ? void 0 : S.mousedown),
                        tI = S ? { ...S
                        } : {
                            mouseenter: !0,
                            focus: !0,
                            click: !1,
                            dblclick: !1,
                            mousedown: !1
                        };
                    !S && tS && Object.assign(tI, {
                        mouseenter: !1,
                        focus: !1,
                        click: !0
                    });
                    let tk = I ? { ...I
                    } : {
                        mouseleave: !0,
                        blur: !0,
                        click: !1,
                        dblclick: !1,
                        mouseup: !1
                    };
                    !I && tS && Object.assign(tk, {
                        mouseleave: !1,
                        blur: !1
                    });
                    let tL = k ? { ...k
                    } : {
                        escape: _ || !1,
                        scroll: A || !1,
                        resize: B || !1,
                        clickOutsideAnchor: tO || !1
                    };
                    L && (Object.assign(tI, {
                        mouseenter: !1,
                        focus: !1,
                        click: !1,
                        dblclick: !1,
                        mousedown: !1
                    }), Object.assign(tk, {
                        mouseleave: !1,
                        blur: !1,
                        click: !1,
                        dblclick: !1,
                        mouseup: !1
                    }), Object.assign(tL, {
                        escape: !1,
                        scroll: !1,
                        resize: !1,
                        clickOutsideAnchor: !1
                    })), tm(() => (tB.current = !0, () => {
                        tB.current = !1
                    }), []);
                    let tR = t => {
                        tB.current && (t && ta(!0), setTimeout(() => {
                            tB.current && (null == z || z(t), void 0 === j && ts(t))
                        }, 10))
                    };
                    (0, n.useEffect)(() => {
                        if (void 0 === j) return () => null;
                        j && ta(!0);
                        let t = setTimeout(() => {
                            ts(j)
                        }, 10);
                        return () => {
                            clearTimeout(t)
                        }
                    }, [j]), (0, n.useEffect)(() => {
                        if (ti !== tp.current) {
                            if (te.current && clearTimeout(te.current), tp.current = ti, ti) null == U || U();
                            else {
                                let t = (t => {
                                    let e = t.match(/^([\d.]+)(ms|s)$/);
                                    if (!e) return 0;
                                    let [, r, n] = e;
                                    return Number(r) * ("ms" === n ? 1 : 1e3)
                                })(getComputedStyle(document.body).getPropertyValue("--rt-transition-show-delay"));
                                te.current = setTimeout(() => {
                                    ta(!1), tc(null), null == P || P()
                                }, t + 25)
                            }
                        }
                    }, [ti]);
                    let tT = t => {
                            tn(e => td(e, t) ? e : t)
                        },
                        tU = (t = v) => {
                            X.current && clearTimeout(X.current), tu ? tR(!0) : X.current = setTimeout(() => {
                                tR(!0)
                            }, t)
                        },
                        tP = (t = w) => {
                            tt.current && clearTimeout(tt.current), tt.current = setTimeout(() => {
                                tM.current || tR(!1)
                            }, t)
                        },
                        tC = t => {
                            var e;
                            if (!t) return;
                            let r = null !== (e = t.currentTarget) && void 0 !== e ? e : t.target;
                            if (!(null == r ? void 0 : r.isConnected)) return Z(null), void tx({
                                current: null
                            });
                            v ? tU() : tR(!0), Z(r), tx({
                                current: r
                            }), tt.current && clearTimeout(tt.current)
                        },
                        tN = () => {
                            M ? tP(w || 100) : w ? tP() : tR(!1), X.current && clearTimeout(X.current)
                        },
                        tj = ({
                            x: t,
                            y: e
                        }) => {
                            var r;
                            tl({
                                place: null !== (r = null == tf ? void 0 : tf.place) && void 0 !== r ? r : h,
                                offset: c,
                                elementReference: {
                                    getBoundingClientRect: () => ({
                                        x: t,
                                        y: e,
                                        width: 0,
                                        height: 0,
                                        top: e,
                                        left: t,
                                        right: t,
                                        bottom: e
                                    })
                                },
                                tooltipReference: Q.current,
                                tooltipArrowReference: J.current,
                                strategy: y,
                                middlewares: m,
                                border: H
                            }).then(t => {
                                tT(t)
                            })
                        },
                        tq = t => {
                            if (!t) return;
                            let e = {
                                x: t.clientX,
                                y: t.clientY
                            };
                            tj(e), tg.current = e
                        },
                        tF = t => {
                            var e;
                            if (!ti) return;
                            let r = t.target;
                            r.isConnected && (null === (e = Q.current) || void 0 === e || !e.contains(r)) && ([document.querySelector(`[id='${l}']`), ...t_].some(t => null == t ? void 0 : t.contains(r)) || (tR(!1), X.current && clearTimeout(X.current)))
                        },
                        tz = th(tC, 50, !0),
                        t$ = th(tN, 50, !0),
                        tD = t => {
                            t$.cancel(), tz(t)
                        },
                        tZ = () => {
                            tz.cancel(), t$()
                        },
                        tH = (0, n.useCallback)(() => {
                            var t, e;
                            let r = null !== (t = null == tf ? void 0 : tf.position) && void 0 !== t ? t : T;
                            r ? tj(r) : b ? tg.current && tj(tg.current) : (null == D ? void 0 : D.isConnected) && tl({
                                place: null !== (e = null == tf ? void 0 : tf.place) && void 0 !== e ? e : h,
                                offset: c,
                                elementReference: D,
                                tooltipReference: Q.current,
                                tooltipArrowReference: J.current,
                                strategy: y,
                                middlewares: m,
                                border: H
                            }).then(t => {
                                tB.current && tT(t)
                            })
                        }, [ti, D, C, R, h, null == tf ? void 0 : tf.place, c, y, T, null == tf ? void 0 : tf.position, b]);
                    (0, n.useEffect)(() => {
                        var t, e;
                        let r = new Set(tv);
                        t_.forEach(t => {
                            r.add({
                                current: t
                            })
                        });
                        let n = document.querySelector(`[id='${l}']`);
                        n && r.add({
                            current: n
                        });
                        let s = () => {
                                tR(!1)
                            },
                            a = ty(D),
                            f = ty(Q.current);
                        tL.scroll && (window.addEventListener("scroll", s), null == a || a.addEventListener("scroll", s), null == f || f.addEventListener("scroll", s));
                        let h = null;
                        tL.resize ? window.addEventListener("resize", s) : D && Q.current && (h = function(t, e, r, n) {
                            let s;
                            void 0 === n && (n = {});
                            let {
                                ancestorScroll: a = !0,
                                ancestorResize: l = !0,
                                elementResize: f = "function" == typeof ResizeObserver,
                                layoutShift: h = "function" == typeof IntersectionObserver,
                                animationFrame: c = !1
                            } = n, d = $(t), p = a || l ? [...d ? F(d) : [], ...F(e)] : [];
                            p.forEach(t => {
                                a && t.addEventListener("scroll", r, {
                                    passive: !0
                                }), l && t.addEventListener("resize", r)
                            });
                            let y = d && h ? function(t, e) {
                                    let r, n = null,
                                        s = O(t);

                                    function a() {
                                        var t;
                                        clearTimeout(r), null == (t = n) || t.disconnect(), n = null
                                    }
                                    return function l(f, h) {
                                        void 0 === f && (f = !1), void 0 === h && (h = 1), a();
                                        let {
                                            left: c,
                                            top: d,
                                            width: p,
                                            height: y
                                        } = t.getBoundingClientRect();
                                        if (f || e(), !p || !y) return;
                                        let m = u(d),
                                            g = u(s.clientWidth - (c + p)),
                                            v = {
                                                rootMargin: -m + "px " + -g + "px " + -u(s.clientHeight - (d + y)) + "px " + -u(c) + "px",
                                                threshold: o(0, i(1, h)) || 1
                                            },
                                            w = !0;

                                        function b(t) {
                                            let e = t[0].intersectionRatio;
                                            if (e !== h) {
                                                if (!w) return l();
                                                e ? l(!1, e) : r = setTimeout(() => {
                                                    l(!1, 1e-7)
                                                }, 100)
                                            }
                                            w = !1
                                        }
                                        try {
                                            n = new IntersectionObserver(b, { ...v,
                                                root: s.ownerDocument
                                            })
                                        } catch (t) {
                                            n = new IntersectionObserver(b, v)
                                        }
                                        n.observe(t)
                                    }(!0), a
                                }(d, r) : null,
                                m = -1,
                                g = null;
                            f && (g = new ResizeObserver(t => {
                                let [n] = t;
                                n && n.target === d && g && (g.unobserve(e), cancelAnimationFrame(m), m = requestAnimationFrame(() => {
                                    var t;
                                    null == (t = g) || t.observe(e)
                                })), r()
                            }), d && !c && g.observe(d), g.observe(e));
                            let v = c ? V(t) : null;
                            return c && function e() {
                                let n = V(t);
                                v && (n.x !== v.x || n.y !== v.y || n.width !== v.width || n.height !== v.height) && r(), v = n, s = requestAnimationFrame(e)
                            }(), r(), () => {
                                var t;
                                p.forEach(t => {
                                    a && t.removeEventListener("scroll", r), l && t.removeEventListener("resize", r)
                                }), null == y || y(), null == (t = g) || t.disconnect(), g = null, c && cancelAnimationFrame(s)
                            }
                        }(D, Q.current, tH, {
                            ancestorResize: !0,
                            elementResize: !0,
                            layoutShift: !0
                        }));
                        let c = t => {
                            "Escape" === t.key && tR(!1)
                        };
                        tL.escape && window.addEventListener("keydown", c), tL.clickOutsideAnchor && window.addEventListener("click", tF);
                        let d = [],
                            p = t => {
                                ti && (null == t ? void 0 : t.target) === D || tC(t)
                            },
                            y = t => {
                                ti && (null == t ? void 0 : t.target) === D && tN()
                            },
                            m = ["mouseenter", "mouseleave", "focus", "blur"],
                            g = ["click", "dblclick", "mousedown", "mouseup"];
                        Object.entries(tI).forEach(([t, e]) => {
                            e && (m.includes(t) ? d.push({
                                event: t,
                                listener: tD
                            }) : g.includes(t) && d.push({
                                event: t,
                                listener: p
                            }))
                        }), Object.entries(tk).forEach(([t, e]) => {
                            e && (m.includes(t) ? d.push({
                                event: t,
                                listener: tZ
                            }) : g.includes(t) && d.push({
                                event: t,
                                listener: y
                            }))
                        }), b && d.push({
                            event: "pointermove",
                            listener: tq
                        });
                        let v = () => {
                                tM.current = !0
                            },
                            w = () => {
                                tM.current = !1, tN()
                            };
                        return M && !tO && (null === (t = Q.current) || void 0 === t || t.addEventListener("mouseenter", v), null === (e = Q.current) || void 0 === e || e.addEventListener("mouseleave", w)), d.forEach(({
                            event: t,
                            listener: e
                        }) => {
                            r.forEach(r => {
                                var n;
                                null === (n = r.current) || void 0 === n || n.addEventListener(t, e)
                            })
                        }), () => {
                            var t, e;
                            tL.scroll && (window.removeEventListener("scroll", s), null == a || a.removeEventListener("scroll", s), null == f || f.removeEventListener("scroll", s)), tL.resize ? window.removeEventListener("resize", s) : null == h || h(), tL.clickOutsideAnchor && window.removeEventListener("click", tF), tL.escape && window.removeEventListener("keydown", c), M && !tO && (null === (t = Q.current) || void 0 === t || t.removeEventListener("mouseenter", v), null === (e = Q.current) || void 0 === e || e.removeEventListener("mouseleave", w)), d.forEach(({
                                event: t,
                                listener: e
                            }) => {
                                r.forEach(r => {
                                    var n;
                                    null === (n = r.current) || void 0 === n || n.removeEventListener(t, e)
                                })
                            })
                        }
                    }, [D, tH, tu, tv, t_, S, I, k, tS, v, w]), (0, n.useEffect)(() => {
                        var t, r;
                        let n = null !== (r = null !== (t = null == tf ? void 0 : tf.anchorSelect) && void 0 !== t ? t : f) && void 0 !== r ? r : "";
                        !n && e && (n = `[data-tooltip-id='${e}']`);
                        let i = new MutationObserver(t => {
                            let r = [],
                                i = [];
                            t.forEach(t => {
                                if ("attributes" === t.type && "data-tooltip-id" === t.attributeName && (t.target.getAttribute("data-tooltip-id") === e ? r.push(t.target) : t.oldValue === e && i.push(t.target)), "childList" === t.type) {
                                    if (D) {
                                        let e = [...t.removedNodes].filter(t => 1 === t.nodeType);
                                        if (n) try {
                                            i.push(...e.filter(t => t.matches(n))), i.push(...e.flatMap(t => [...t.querySelectorAll(n)]))
                                        } catch (t) {}
                                        e.some(t => {
                                            var e;
                                            return !!(null === (e = null == t ? void 0 : t.contains) || void 0 === e ? void 0 : e.call(t, D)) && (ta(!1), tR(!1), Z(null), X.current && clearTimeout(X.current), tt.current && clearTimeout(tt.current), !0)
                                        })
                                    }
                                    if (n) try {
                                        let e = [...t.addedNodes].filter(t => 1 === t.nodeType);
                                        r.push(...e.filter(t => t.matches(n))), r.push(...e.flatMap(t => [...t.querySelectorAll(n)]))
                                    } catch (t) {}
                                }
                            }), (r.length || i.length) && tA(t => [...t.filter(t => !i.includes(t)), ...r])
                        });
                        return i.observe(document.body, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0,
                            attributeFilter: ["data-tooltip-id"],
                            attributeOldValue: !0
                        }), () => {
                            i.disconnect()
                        }
                    }, [e, f, null == tf ? void 0 : tf.anchorSelect, D]), (0, n.useEffect)(() => {
                        tH()
                    }, [tH]), (0, n.useEffect)(() => {
                        if (!(null == N ? void 0 : N.current)) return () => null;
                        let t = new ResizeObserver(() => {
                            setTimeout(() => tH())
                        });
                        return t.observe(N.current), () => {
                            t.disconnect()
                        }
                    }, [C, null == N ? void 0 : N.current]), (0, n.useEffect)(() => {
                        var t;
                        let e = document.querySelector(`[id='${l}']`),
                            r = [...t_, e];
                        D && r.includes(D) || Z(null !== (t = t_[0]) && void 0 !== t ? t : e)
                    }, [l, t_, D]), (0, n.useEffect)(() => (q && tR(!0), () => {
                        X.current && clearTimeout(X.current), tt.current && clearTimeout(tt.current)
                    }), []), (0, n.useEffect)(() => {
                        var t;
                        let r = null !== (t = null == tf ? void 0 : tf.anchorSelect) && void 0 !== t ? t : f;
                        if (!r && e && (r = `[data-tooltip-id='${e}']`), r) try {
                            let t = Array.from(document.querySelectorAll(r));
                            tA(t)
                        } catch (t) {
                            tA([])
                        }
                    }, [e, f, null == tf ? void 0 : tf.anchorSelect]), (0, n.useEffect)(() => {
                        X.current && (clearTimeout(X.current), tU(v))
                    }, [v]);
                    let tV = null !== (Y = null == tf ? void 0 : tf.content) && void 0 !== Y ? Y : C,
                        tG = ti && Object.keys(tr.tooltipStyles).length > 0;
                    return (0, n.useImperativeHandle)(t, () => ({
                        open: t => {
                            if (null == t ? void 0 : t.anchorSelect) try {
                                document.querySelector(t.anchorSelect)
                            } catch (e) {
                                return void console.warn(`[react-tooltip] "${t.anchorSelect}" is not a valid CSS selector`)
                            }
                            tc(null != t ? t : null), (null == t ? void 0 : t.delay) ? tU(t.delay) : tR(!0)
                        },
                        close: t => {
                            (null == t ? void 0 : t.delay) ? tP(t.delay): tR(!1)
                        },
                        activeAnchor: D,
                        place: tr.place,
                        isOpen: !!(tu && !E && tV && tG)
                    })), tu && !E && tV ? n.createElement(g, {
                        id: e,
                        role: K,
                        className: to("react-tooltip", tb.tooltip, tE.tooltip, tE[a], r, `react-tooltip__place-${tr.place}`, tb[tG ? "show" : "closing"], tG ? "react-tooltip__show" : "react-tooltip__closing", "fixed" === y && tb.fixed, M && tb.clickable),
                        onTransitionEnd: t => {
                            te.current && clearTimeout(te.current), ti || "opacity" !== t.propertyName || (ta(!1), tc(null), null == P || P())
                        },
                        style: { ...R,
                            ...tr.tooltipStyles,
                            opacity: void 0 !== G && tG ? G : void 0
                        },
                        ref: Q
                    }, tV, n.createElement(g, {
                        className: to("react-tooltip-arrow", tb.arrow, tE.arrow, s, x && tb.noArrow),
                        style: { ...tr.tooltipArrowStyles,
                            background: W ? `linear-gradient(to right bottom, transparent 50%, ${W} 50%)` : void 0
                        },
                        ref: J
                    })) : null
                },
                tM = ({
                    content: t
                }) => n.createElement("span", {
                    dangerouslySetInnerHTML: {
                        __html: t
                    }
                }),
                t_ = n.forwardRef(({
                    id: t,
                    anchorId: e,
                    anchorSelect: r,
                    content: i,
                    html: o,
                    render: s,
                    className: u,
                    classNameArrow: a,
                    variant: l = "dark",
                    place: f = "top",
                    offset: h = 10,
                    wrapper: c = "div",
                    children: d = null,
                    events: p = ["hover"],
                    openOnClick: y = !1,
                    positionStrategy: m = "absolute",
                    middlewares: g,
                    delayShow: v = 0,
                    delayHide: w = 0,
                    float: b = !1,
                    hidden: E = !1,
                    noArrow: x = !1,
                    clickable: M = !1,
                    closeOnEsc: _ = !1,
                    closeOnScroll: A = !1,
                    closeOnResize: B = !1,
                    openEvents: S,
                    closeEvents: O,
                    globalCloseEvents: I,
                    imperativeModeOnly: k = !1,
                    style: L,
                    position: R,
                    isOpen: T,
                    defaultIsOpen: U = !1,
                    disableStyleInjection: P = !1,
                    border: C,
                    opacity: N,
                    arrowColor: j,
                    setIsOpen: q,
                    afterShow: F,
                    afterHide: z,
                    role: $ = "tooltip"
                }, D) => {
                    let [Z, H] = (0, n.useState)(i), [V, G] = (0, n.useState)(o), [W, K] = (0, n.useState)(f), [Y, Q] = (0, n.useState)(l), [J, X] = (0, n.useState)(h), [tt, te] = (0, n.useState)(v), [tr, tn] = (0, n.useState)(w), [ti, ts] = (0, n.useState)(b), [tu, ta] = (0, n.useState)(E), [tl, th] = (0, n.useState)(c), [tc, td] = (0, n.useState)(p), [tp, ty] = (0, n.useState)(m), [tm, tg] = (0, n.useState)(null), [tv, tb] = (0, n.useState)(null), tE = (0, n.useRef)(P), {
                        anchorRefs: t_,
                        activeAnchor: tA
                    } = tw(t), tB = t => null == t ? void 0 : t.getAttributeNames().reduce((e, r) => {
                        var n;
                        return r.startsWith("data-tooltip-") && (e[r.replace(/^data-tooltip-/, "")] = null !== (n = null == t ? void 0 : t.getAttribute(r)) && void 0 !== n ? n : null), e
                    }, {}), tS = t => {
                        let e = {
                            place: t => {
                                K(null != t ? t : f)
                            },
                            content: t => {
                                H(null != t ? t : i)
                            },
                            html: t => {
                                G(null != t ? t : o)
                            },
                            variant: t => {
                                Q(null != t ? t : l)
                            },
                            offset: t => {
                                X(null === t ? h : Number(t))
                            },
                            wrapper: t => {
                                th(null != t ? t : c)
                            },
                            events: t => {
                                let e = null == t ? void 0 : t.split(" ");
                                td(null != e ? e : p)
                            },
                            "position-strategy": t => {
                                ty(null != t ? t : m)
                            },
                            "delay-show": t => {
                                te(null === t ? v : Number(t))
                            },
                            "delay-hide": t => {
                                tn(null === t ? w : Number(t))
                            },
                            float: t => {
                                ts(null === t ? b : "true" === t)
                            },
                            hidden: t => {
                                ta(null === t ? E : "true" === t)
                            },
                            "class-name": t => {
                                tg(t)
                            }
                        };
                        Object.values(e).forEach(t => t(null)), Object.entries(t).forEach(([t, r]) => {
                            var n;
                            null === (n = e[t]) || void 0 === n || n.call(e, r)
                        })
                    };
                    (0, n.useEffect)(() => {
                        H(i)
                    }, [i]), (0, n.useEffect)(() => {
                        G(o)
                    }, [o]), (0, n.useEffect)(() => {
                        K(f)
                    }, [f]), (0, n.useEffect)(() => {
                        Q(l)
                    }, [l]), (0, n.useEffect)(() => {
                        X(h)
                    }, [h]), (0, n.useEffect)(() => {
                        te(v)
                    }, [v]), (0, n.useEffect)(() => {
                        tn(w)
                    }, [w]), (0, n.useEffect)(() => {
                        ts(b)
                    }, [b]), (0, n.useEffect)(() => {
                        ta(E)
                    }, [E]), (0, n.useEffect)(() => {
                        ty(m)
                    }, [m]), (0, n.useEffect)(() => {
                        tE.current !== P && console.warn("[react-tooltip] Do not change `disableStyleInjection` dynamically.")
                    }, [P]), (0, n.useEffect)(() => {
                        "undefined" != typeof window && window.dispatchEvent(new CustomEvent("react-tooltip-inject-styles", {
                            detail: {
                                disableCore: "core" === P,
                                disableBase: P
                            }
                        }))
                    }, []), (0, n.useEffect)(() => {
                        var n;
                        let i = new Set(t_),
                            o = r;
                        if (!o && t && (o = `[data-tooltip-id='${t}']`), o) try {
                            document.querySelectorAll(o).forEach(t => {
                                i.add({
                                    current: t
                                })
                            })
                        } catch (t) {
                            console.warn(`[react-tooltip] "${o}" is not a valid CSS selector`)
                        }
                        let s = document.querySelector(`[id='${e}']`);
                        if (s && i.add({
                                current: s
                            }), !i.size) return () => null;
                        let u = null !== (n = null != tv ? tv : s) && void 0 !== n ? n : tA.current,
                            a = new MutationObserver(t => {
                                t.forEach(t => {
                                    var e;
                                    u && "attributes" === t.type && (null === (e = t.attributeName) || void 0 === e ? void 0 : e.startsWith("data-tooltip-")) && tS(tB(u))
                                })
                            });
                        return u && (tS(tB(u)), a.observe(u, {
                            attributes: !0,
                            childList: !1,
                            subtree: !1
                        })), () => {
                            a.disconnect()
                        }
                    }, [t_, tA, tv, e, r]), (0, n.useEffect)(() => {
                        (null == L ? void 0 : L.border) && console.warn("[react-tooltip] Do not set `style.border`. Use `border` prop instead."), C && !tf("border", `${C}`) && console.warn(`[react-tooltip] "${C}" is not a valid \`border\`.`), (null == L ? void 0 : L.opacity) && console.warn("[react-tooltip] Do not set `style.opacity`. Use `opacity` prop instead."), N && !tf("opacity", `${N}`) && console.warn(`[react-tooltip] "${N}" is not a valid \`opacity\`.`)
                    }, []);
                    let tO = d,
                        tI = (0, n.useRef)(null);
                    if (s) {
                        let t = s({
                            content: (null == tv ? void 0 : tv.getAttribute("data-tooltip-content")) || Z || null,
                            activeAnchor: tv
                        });
                        tO = t ? n.createElement("div", {
                            ref: tI,
                            className: "react-tooltip-content-wrapper"
                        }, t) : null
                    } else Z && (tO = Z);
                    V && (tO = n.createElement(tM, {
                        content: V
                    }));
                    let tk = {
                        forwardRef: D,
                        id: t,
                        anchorId: e,
                        anchorSelect: r,
                        className: to(u, tm),
                        classNameArrow: a,
                        content: tO,
                        contentWrapperRef: tI,
                        place: W,
                        variant: Y,
                        offset: J,
                        wrapper: tl,
                        events: tc,
                        openOnClick: y,
                        positionStrategy: tp,
                        middlewares: g,
                        delayShow: tt,
                        delayHide: tr,
                        float: ti,
                        hidden: tu,
                        noArrow: x,
                        clickable: M,
                        closeOnEsc: _,
                        closeOnScroll: A,
                        closeOnResize: B,
                        openEvents: S,
                        closeEvents: O,
                        globalCloseEvents: I,
                        imperativeModeOnly: k,
                        style: L,
                        position: R,
                        isOpen: T,
                        defaultIsOpen: U,
                        border: C,
                        opacity: N,
                        arrowColor: j,
                        setIsOpen: q,
                        afterShow: F,
                        afterHide: z,
                        activeAnchor: tv,
                        setActiveAnchor: t => tb(t),
                        role: $
                    };
                    return n.createElement(tx, { ...tk
                    })
                });
            "undefined" != typeof window && window.addEventListener("react-tooltip-inject-styles", t => {
                t.detail.disableCore || ta({
                    css: ":root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9;--rt-transition-show-delay:0.15s;--rt-transition-closing-delay:0.15s}.core-styles-module_tooltip__3vRRp{position:absolute;top:0;left:0;pointer-events:none;opacity:0;will-change:opacity}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{opacity:var(--rt-opacity);transition:opacity var(--rt-transition-show-delay)ease-out}.core-styles-module_closing__sGnxF{opacity:0;transition:opacity var(--rt-transition-closing-delay)ease-in}",
                    type: "core"
                }), t.detail.disableBase || ta({
                    css: `
.styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px}[class*='react-tooltip__place-top']>.styles-module_arrow__K0L3T{transform:rotate(45deg)}[class*='react-tooltip__place-right']>.styles-module_arrow__K0L3T{transform:rotate(135deg)}[class*='react-tooltip__place-bottom']>.styles-module_arrow__K0L3T{transform:rotate(225deg)}[class*='react-tooltip__place-left']>.styles-module_arrow__K0L3T{transform:rotate(315deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}`,
                    type: "base"
                })
            })
        },
        1693: function(t, e, r) {
            "use strict";
            r.d(e, {
                AG: function() {
                    return g
                },
                G0: function() {
                    return _
                },
                IM: function() {
                    return b
                },
                IX: function() {
                    return d
                },
                O7: function() {
                    return p
                },
                Rx: function() {
                    return v
                },
                Ue: function() {
                    return l
                },
                Yj: function() {
                    return c
                },
                Z_: function() {
                    return E
                },
                _4: function() {
                    return A
                },
                bc: function() {
                    return x
                },
                dt: function() {
                    return M
                },
                eE: function() {
                    return y
                },
                i0: function() {
                    return m
                },
                jt: function() {
                    return w
                },
                oQ: function() {
                    return B
                }
            });
            class n extends TypeError {
                constructor(t, e) {
                    let r;
                    let {
                        message: n,
                        ...i
                    } = t, {
                        path: o
                    } = t;
                    super(0 === o.length ? n : "At path: " + o.join(".") + " -- " + n), Object.assign(this, i), this.name = this.constructor.name, this.failures = () => {
                        var n;
                        return null != (n = r) ? n : r = [t, ...e()]
                    }
                }
            }

            function i(t) {
                return "object" == typeof t && null != t
            }

            function o(t) {
                return "string" == typeof t ? JSON.stringify(t) : "" + t
            }

            function* s(t, e, r, n) {
                var s;
                for (let u of (i(s = t) && "function" == typeof s[Symbol.iterator] || (t = [t]), t)) {
                    let t = function(t, e, r, n) {
                        if (!0 === t) return;
                        !1 === t ? t = {} : "string" == typeof t && (t = {
                            message: t
                        });
                        let {
                            path: i,
                            branch: s
                        } = e, {
                            type: u
                        } = r, {
                            refinement: a,
                            message: l = "Expected a value of type `" + u + "`" + (a ? " with refinement `" + a + "`" : "") + ", but received: `" + o(n) + "`"
                        } = t;
                        return {
                            value: n,
                            type: u,
                            refinement: a,
                            key: i[i.length - 1],
                            path: i,
                            branch: s,
                            ...t,
                            message: l
                        }
                    }(u, e, r, n);
                    t && (yield t)
                }
            }

            function* u(t, e, r = {}) {
                let {
                    path: n = [],
                    branch: o = [t],
                    coerce: s = !1,
                    mask: a = !1
                } = r, l = {
                    path: n,
                    branch: o
                };
                if (s && (t = e.coercer(t, l), a && "type" !== e.type && i(e.schema) && i(t) && !Array.isArray(t)))
                    for (let r in t) void 0 === e.schema[r] && delete t[r];
                let f = !0;
                for (let r of e.validator(t, l)) f = !1, yield [r, void 0];
                for (let [r, h, c] of e.entries(t, l))
                    for (let e of u(h, c, {
                            path: void 0 === r ? n : [...n, r],
                            branch: void 0 === r ? o : [...o, h],
                            coerce: s,
                            mask: a
                        })) e[0] ? (f = !1, yield [e[0], void 0]) : s && (h = e[1], void 0 === r ? t = h : t instanceof Map ? t.set(r, h) : t instanceof Set ? t.add(h) : i(t) && (t[r] = h));
                if (f)
                    for (let r of e.refiner(t, l)) f = !1, yield [r, void 0];
                f && (yield [void 0, t])
            }
            class a {
                constructor(t) {
                    let {
                        type: e,
                        schema: r,
                        validator: n,
                        refiner: i,
                        coercer: o = t => t,
                        entries: u = function*() {}
                    } = t;
                    this.type = e, this.schema = r, this.entries = u, this.coercer = o, n ? this.validator = (t, e) => s(n(t, e), e, this, t) : this.validator = () => [], i ? this.refiner = (t, e) => s(i(t, e), e, this, t) : this.refiner = () => []
                }
                assert(t) {
                    return function(t, e) {
                        let r = f(t, e);
                        if (r[0]) throw r[0]
                    }(t, this)
                }
                create(t) {
                    return l(t, this)
                }
                is(t) {
                    return !f(t, this)[0]
                }
                mask(t) {
                    return function(t, e) {
                        let r = f(t, e, {
                            coerce: !0,
                            mask: !0
                        });
                        if (!r[0]) return r[1];
                        throw r[0]
                    }(t, this)
                }
                validate(t, e = {}) {
                    return f(t, this, e)
                }
            }

            function l(t, e) {
                let r = f(t, e, {
                    coerce: !0
                });
                if (!r[0]) return r[1];
                throw r[0]
            }

            function f(t, e, r = {}) {
                let i = u(t, e, r),
                    o = function(t) {
                        let {
                            done: e,
                            value: r
                        } = t.next();
                        return e ? void 0 : r
                    }(i);
                return o[0] ? [new n(o[0], function*() {
                    for (let t of i) t[0] && (yield t[0])
                }), void 0] : [void 0, o[1]]
            }

            function h(t, e) {
                return new a({
                    type: t,
                    schema: null,
                    validator: e
                })
            }

            function c() {
                return h("any", () => !0)
            }

            function d(t) {
                return new a({
                    type: "array",
                    schema: t,
                    * entries(e) {
                        if (t && Array.isArray(e))
                            for (let [r, n] of e.entries()) yield [r, n, t]
                    },
                    coercer: t => Array.isArray(t) ? t.slice() : t,
                    validator: t => Array.isArray(t) || "Expected an array value, but received: " + o(t)
                })
            }

            function p() {
                return h("boolean", t => "boolean" == typeof t)
            }

            function y(t) {
                return h("instance", e => e instanceof t || "Expected a `" + t.name + "` instance, but received: " + o(e))
            }

            function m(t) {
                let e = o(t),
                    r = typeof t;
                return new a({
                    type: "literal",
                    schema: "string" === r || "number" === r || "boolean" === r ? t : null,
                    validator: r => r === t || "Expected the literal `" + e + "`, but received: " + o(r)
                })
            }

            function g(t) {
                return new a({ ...t,
                    validator: (e, r) => null === e || t.validator(e, r),
                    refiner: (e, r) => null === e || t.refiner(e, r)
                })
            }

            function v() {
                return h("number", t => "number" == typeof t && !isNaN(t) || "Expected a number, but received: " + o(t))
            }

            function w(t) {
                return new a({ ...t,
                    validator: (e, r) => void 0 === e || t.validator(e, r),
                    refiner: (e, r) => void 0 === e || t.refiner(e, r)
                })
            }

            function b(t, e) {
                return new a({
                    type: "record",
                    schema: null,
                    * entries(r) {
                        if (i(r))
                            for (let n in r) {
                                let i = r[n];
                                yield [n, n, t], yield [n, i, e]
                            }
                    },
                    validator: t => i(t) || "Expected an object, but received: " + o(t)
                })
            }

            function E() {
                return h("string", t => "string" == typeof t || "Expected a string, but received: " + o(t))
            }

            function x(t) {
                let e = h("never", () => !1);
                return new a({
                    type: "tuple",
                    schema: null,
                    * entries(r) {
                        if (Array.isArray(r)) {
                            let n = Math.max(t.length, r.length);
                            for (let i = 0; i < n; i++) yield [i, r[i], t[i] || e]
                        }
                    },
                    validator: t => Array.isArray(t) || "Expected an array, but received: " + o(t)
                })
            }

            function M(t) {
                let e = Object.keys(t);
                return new a({
                    type: "type",
                    schema: t,
                    * entries(r) {
                        if (i(r))
                            for (let n of e) yield [n, r[n], t[n]]
                    },
                    validator: t => i(t) || "Expected an object, but received: " + o(t)
                })
            }

            function _(t) {
                let e = t.map(t => t.type).join(" | ");
                return new a({
                    type: "union",
                    schema: null,
                    validator(r, n) {
                        let i = [];
                        for (let e of t) {
                            let [...t] = u(r, e, n), [o] = t;
                            if (!o[0]) return [];
                            for (let [e] of t) e && i.push(e)
                        }
                        return ["Expected the value to satisfy a union of `" + e + "`, but received: " + o(r), ...i]
                    }
                })
            }

            function A() {
                return h("unknown", () => !0)
            }

            function B(t, e, r) {
                return new a({ ...t,
                    coercer: (n, i) => f(n, e)[0] ? t.coercer(n, i) : t.coercer(r(n, i), i)
                })
            }
        }
    }
]);