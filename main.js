(() => {
    function hexToRgba(hex) {
        hex = hex.replace(/^#/, '');

        // Expand shorthand (#RGB or #RGBA)
        if (hex.length === 3 || hex.length === 4) {
            hex = hex.split('').map(c => c + c).join('');
        }

        let r, g, b, a;

        if (hex.length === 6) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
            a = 255; // fully opaque
        } else if (hex.length === 8) {
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
            a = parseInt(hex.slice(6, 8), 16);
        } else {
            throw new Error("Invalid hex color: " + hex);
        }

        return [r, g, b, a];
    }
    function rgba_to_hex(r, g, b, a = 255) {
        const hex = [parseInt(r), parseInt(g), parseInt(b), parseInt(a)].map(x => {
            return Math.max(Math.min(x, 255), 0).toString(16).padStart(2, '0')
        }).join('');

        return `#${hex}`;
    }

    const colors = [];
    let last = "rgb"

    class ColorPickerMenu extends HTMLElement {
        update() {
            let [r, g, b, a] = hexToRgba(this.value);
            this.r.value = r;
            this.lr.value = r;
            const rg = `
                linear-gradient(to right, rgba(0, ${g}, ${b}, ${a/255}), rgba(255, ${g}, ${b}, ${a/255}))
            `;
            this.r.style.backgroundColor = rg
            this.r.style.setProperty('--moz-track', rg);
            this.r.style.setProperty('background', rg)

            const gg = `
                linear-gradient(to right, rgba(${r}, 0, ${b}, ${a/255}), rgba(${r}, 255, ${b}, ${a/255}))
            `;
            this.g.value = g;
            this.lg.value = g;
            this.g.style.backgroundColor = gg
            this.g.style.setProperty('--moz-track', gg);
            this.g.style.setProperty('background', gg)


            const bg = `
                linear-gradient(to right, rgba(${r}, ${g}, 0, ${a/255}), rgba(${r}, ${g}, 255, ${a/255}))
            `;
            this.b.value = b;
            this.lb.value = b;
            this.b.style.backgroundColor = bg
            this.b.style.setProperty('--moz-track', bg);
            this.b.style.setProperty('background', bg)

            const ag = `
                linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 1))
            `;
            this.a.value = a;
            this.la.value = a;
            this.a.style.backgroundColor = ag
            this.a.style.setProperty('--moz-track', ag);
            this.a.style.setProperty('background', ag)

        }
        connectedCallback() {
            this.r.addEventListener("input", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                r = this.r.value;
                this.value = rgba_to_hex(r, g, b, a);
            })
            this.lr.addEventListener("change", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                r = this.lr.value;
                this.value = rgba_to_hex(r, g, b, a);
            })

            this.g.addEventListener("input", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                g = this.g.value;
                this.value = rgba_to_hex(r, g, b, a);
            })
            this.lg.addEventListener("change", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                g = this.lg.value;
                this.value = rgba_to_hex(r, g, b, a);
            })

            this.b.addEventListener("input", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                b = this.b.value;
                this.value = rgba_to_hex(r, g, b, a);
            })
            this.lb.addEventListener("change", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                b = this.lb.value;
                this.value = rgba_to_hex(r, g, b, a);
            })
            
            this.a.addEventListener("input", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                a = this.a.value;
                this.value = rgba_to_hex(r, g, b, a);
            })
            this.la.addEventListener("change", () => {
                let [r, g, b, a] = hexToRgba(this.value);
                a = this.la.value;
                this.value = rgba_to_hex(r, g, b, a);
            })

            this.tabs.addEventListener("change", () => {
                last = this.tabs.value;
                this.setTab();
            })
            this.save.addEventListener("mousedown", () => {
                colors.push(this.value);
                this.blur();
            })
            this.addEventListener("focusout", () => this.remove());
            if(!this.value) this.value = "#000000"
            this.update();
            this.tabIndex = 0
            requestAnimationFrame(() => this.focus());
        }
        setTab() {
            switch(this.tabs.value) {
                case "rgb": {
                    this.rgb_picker.style.display = "block";
                    this.swatches.style.display = "none";
                }
                    break;
                case "swatch": {
                    this.rgb_picker.style.display = "none";
                    this.swatches.style.display = "block";
                }
                    break;
            }
        }
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.box = document.createElement('div');
            this.box.id = "background"
            const style = document.createElement('style');
            style.textContent = `
            :host {
                border: 4px solid #000;
                border-radius: 10px;
                position: absolute;
                display: inline-block;
                width: 250px;
                height: 180px;
                box-sizing: border-box;
            }
                .slider-wrapper {
                    position: relative;
                    height: 16px; /* match slider height */
                        border-radius: 5px;
                    background-color: white;
                    background-image:
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0;
                }

            input[type="range"] {
                margin-left: 10px;
                margin-right: 7px;
                flex: 1;
                -webkit-appearance: none;
                height: 16px;
                border-radius: 5px;
                background: transparent;
                outline: none;
                margin: 0;
            }
            input[type="range"]::-moz-range-track {
                background: transparent;
                height: 16px;
                border-radius: 5px;
            }
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #00f;
                cursor: pointer;
                border: 2px solid #000;
                margin-top: -4px; /* center thumb on track */
            }

            input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #00f;
                cursor: pointer;
                border: 2px solid #000;
            }
            #background {
                width: 100%;
                height: 100%;
                background: #ffffff;
            }
            .c {
                padding-top: 10px;
                display: flex;
                flex-direction: row;
                gap: 5px;
                width: 100%;
            }
            input[type=number]{
                width: 90px;
                margin-right: 5px;
            } 
            .option {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin: 2px;
            }
            `;
            const cr = document.createElement('div')
            cr.classList.add("c") 
            const wr = document.createElement('div')
            wr.classList.add("slider-wrapper")
            this.rgb_picker = document.createElement("div");

            this.swatches = document.createElement("div");
            for(const c of colors) {
                const col = document.createElement("div"); 
                col.classList.add("option");
                col.style.backgroundColor = c;
                col.addEventListener("mousedown", () => {
                    this.value = c;
                })
                this.swatches.appendChild(col)
            }
            this.lr = document.createElement('input');
            this.lr.type = "number"
            this.lr.min = "0";
            this.lr.max = "255";
            this.r = document.createElement('input')
            this.r.type = "range"
            this.r.min = "0";
            this.r.max = "255";
            wr.appendChild(this.r)
            cr.appendChild(wr);
            cr.appendChild(this.lr);
            this.rgb_picker.appendChild(cr);

            const cg = document.createElement('div')
            cg.classList.add("c") 
            const wg = document.createElement('div')
            wg.classList.add("slider-wrapper")
            this.lg = document.createElement('input');
            this.lg.type = "number"
            this.lg.min = "0";
            this.lg.max = "255";
            this.g = document.createElement('input')
            this.g.type = "range"
            this.g.min = "0";
            this.g.max = "255";
            wg.appendChild(this.g)
            cg.appendChild(wg);
            cg.appendChild(this.lg);
            this.rgb_picker.appendChild(cg);

            const cb = document.createElement('div')
            cb.classList.add("c") 
            const wb = document.createElement('div')
            wb.classList.add("slider-wrapper")
            this.lb = document.createElement('input');
            this.lb.type = "number"
            this.lb.min = "0";
            this.lb.max = "255";
            this.b = document.createElement('input')
            this.b.type = "range"
            this.b.min = "0";
            this.b.max = "255";
            wb.appendChild(this.b)
            cb.appendChild(wb);
            cb.appendChild(this.lb);
            this.rgb_picker.appendChild(cb);

            const ca = document.createElement('div')
            ca.classList.add("c") 
            const wa = document.createElement('div')
            wa.classList.add("slider-wrapper")
            this.la = document.createElement('input');
            this.la.type = "number"
            this.la.min = "0";
            this.la.max = "255";
            this.a = document.createElement('input')
            this.a.type = "range"
            this.a.min = "0";
            this.a.max = "255";
            wa.appendChild(this.a)
            ca.appendChild(wa);
            ca.appendChild(this.la);
            this.rgb_picker.appendChild(ca);

            this.save = document.createElement("button");
            this.save.textContent = "Save";
            this.rgb_picker.appendChild(this.save)

            this.tabs = document.createElement("select");
            this.tabs.innerHTML = "<option value='rgb'>rgb</option><option value='swatch'>swatch</option>"
            this.tabs.value = last;
            this.setTab();
            this.box.appendChild(this.tabs);
            this.box.appendChild(this.rgb_picker);
            this.box.appendChild(this.swatches);
            this.shadowRoot.append(style, this.box);
        }
        static get observedAttributes() { return ['value']; }

        get value() {
            return this.getAttribute('value');
        }
        set value(val) {
            this.setAttribute('value', val);
            this.dispatchEvent(new Event('change'));
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name === "value") {
                this.update();
            }
        }
    }

    customElements.define('color-picker-menu', ColorPickerMenu)


    class ColorPicker extends HTMLElement {
        connectedCallback() {
            if(!this.value) this.value = "#000000"
        }
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.box = document.createElement('div');
            const c = document.createElement('div');
            c.id = "x";
            c.appendChild(this.box);
            const style = document.createElement('style');
            style.textContent = `
            :host {
                display: inline-block;
                width: 50px;
                height: 20px;
            }
            #x {
                width: 100%;
                height: 100%;
                background-color: white;
                background-image:
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0;
            }
            div {
                width: 100%;
                height: 100%;
                border: 2px solid black;
                cursor: pointer;
            }
            `;
            this.shadowRoot.append(style);
            this.shadowRoot.append(c);
            this.addEventListener("mousedown", () => {
                if(document.contains(this.menu)) return;
                const c = document.createElement("color-picker-menu");
                c.value = this.value;
                c.style.top = (this.getBoundingClientRect().top + this.getBoundingClientRect().height + 5) + "px";
                c.style.left = this.getBoundingClientRect().left + "px";
                this.menu = c;
                document.body.appendChild(c);
                c.addEventListener("change", () => {
                    this.value = c.value;
                })
            })
        }
        static get observedAttributes() { return ['value']; }

        get value() {
            return this.getAttribute('value');
        }

        set value(val) {
            this.setAttribute('value', val);
            this.dispatchEvent(new Event('change'));
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'value') {
                this.box.style.backgroundColor = newValue;
            }
        }
    }

    customElements.define('color-picker', ColorPicker)
})()
