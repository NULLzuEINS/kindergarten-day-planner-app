/* eslint-disable vue/no-deprecated-filter */
<template>
  <header class="dayplanner" v-if="isNotInIframe">
    <h1 class="text-center">KiTa Tagesplaner</h1>
    <p>
      Erstellen Sie hier einen individuellen Plan für Ihren pädagogischen
      Alltag. Wählen Sie ein Layout und ziehen Sie einfach alle benötigten
      Tagespunkte von der linken auf die rechte Seite! Für eine Voransicht der
      Tagespunkte klicken Sie auf <small>►</small>. Wenn Sie fertig sind,
      schließen Sie mit "Tagesplan erstellen" den Vorgang ab.
    </p>
  </header>

  <section class="dayplanner">
    <h2>Wählen Sie ein Layout</h2>
    <ul class="layout-selector">
      <li
        v-for="layout in layouts"
        :key="layout.id"
        class="layout-selector-item"
      >
        <input
          type="radio"
          name="layout"
          :checked="layout.checked"
          :id="layout.id"
        />
        <label :for="layout.id" @click="storeSetLayout(layout)">
          <img
            :src="layout.preview"
            width="80"
            :title="layout.description"
            :alt="layout.description"
        /></label>
      </li>
    </ul>
  </section>

  <section class="dayplanner">
    <h2>Wählen Sie die Tagesordnungspunkte</h2>
    <div class="dayplanner-row">
      <div class="dayplanner-col">
        <h3>Verfügbare Tagespunkte</h3>
        <draggable
          class="dayplanner-group dayplanner-group-available"
          ghost-class="dayplanner-ghost"
          chosen-class="dayplanner-choosen"
          tag="ul"
          :list="itemsAvailable"
          :group="{
            name: 'dayplanner',
            pull: 'clone',
            put: false,
            sort: false
          }"
          item-key="id"
        >
          <template #item="{ element }">
            <li
              class="dayplanner-item"
              :class="{ 'dayplanner-item--text': (element.type === 'text') }"
            >
              <button class="dayplanner-item-btn dayplanner-item-btn--handle">
                ☰
              </button>
              <details class="dayplanner-text">
                <summary>{{ element.description }}</summary>
                <p v-if="element.type === 'image'">
                  <img
                    :src="`/img/planer/${element.filename}`"
                    height="150"
                    :alt="element.description"
                    loading="lazy"
                  />
                </p>
                <p v-else-if="element.type === 'text'">
                  Fügen Sie dieses Element per Drag & Drop hinzu, um selbst einen Text einzugeben.
                </p>
              </details>
              <button class="dayplanner-item-btn dayplanner-item-btn--add" @click="storeAddItem(element)">
                ＋
              </button>
            </li>
          </template>
        </draggable>
      </div>

      <div class="dayplanner-col">
        <h3>Ausgewählte Tagespunkte</h3>
        <draggable
          class="dayplanner-group dayplanner-group-selected"
          ghost-class="dayplanner-ghost"
          chosen-class="dayplanner-choosen"
          :group="{
            name: 'dayplanner',
            put: true,
            sort: true
          }"
          tag="ol"
          @change="storeSetSettings"
          :list="itemsSelected"
          :item-key="Math.round(Math.random() * 1000).toString()"
        >
          <template #item="{ element, index }">
            <li class="dayplanner-item">
              <button class="dayplanner-item-btn dayplanner-item-btn--handle">
                ☰
              </button>
              <details
                class="dayplanner-text"
                v-if="element.type === 'image'"
                :open="element.open"
              >
                <summary @click="storeSetSettings()">{{
                  element.description
                }}</summary>
                <p v-if="element.type === 'image'">
                  <img
                    v-if="element.type === 'image'"
                    :src="`/img/planer/${element.filename}`"
                    :alt="element.description"
                    height="150"
                    loading="lazy"
                  />
                </p>
              </details>

              <details
                class="dayplanner-text dayplanner-text--type-text"
                v-if="element.type === 'text'"
                :open="element.open"
              >
                <summary :title="element.text">
                  <strong>Text</strong>
                </summary>
                <p>
                  <textarea
                    key="text"
                    :id="'text-' + index"
                    :name="'text-' + index"
                    :ref="'text-' + index"
                    :placeholder="element.placeholder"
                    v-model="element.text"
                    @change="storeSetSettings()"
                    rows="5"
                    cols="42"
                    maxlength="144"
                  ></textarea>
                  <span v-html="checkTextfieldLength(element.text)" />
                </p>
              </details>
              <button
                @click="storeRemoveFromSelected(index)"
                class="dayplanner-item-btn dayplanner-item-btn--delete"
              >
                ⌫
              </button>
            </li>
          </template>
        </draggable>
      </div>
    </div>
  </section>

  <section class="dayplanner">
    <div class="alert alert-primary" role="alert">
      Das Erstellen des Dokumentes kann einige Sekunden in Anspruch nehmen.
      Bitte warten Sie, bis der Download der PDF startet!
    </div>
    <p class="text-center">
      <Button
        @click="createDocument()"
        class="btn btn-large"
        :disabled="!itemsSelected.length"
        >🖨 Tagesplan erstellen</Button
      >
    </p>
  </section>
  <footer v-if="isNotInIframe && (isShareable || isPWA)">
    <p v-if="isShareable">
      Wenn Ihnen der Tagesplaner gefällt, können Sie ihn auch mit einem Klick
      auf den Button <Button @click="shareViaWebShare">teilen</Button>!
    </p>
		<div v-if="isPwa">
      Installierte Version: {{ version }}
      (<button @click="unregisterServiceWorker">deinstallieren</button>,
      <button @click="updateServiceWorker">update</button>,
      <button @click="registerServiceWorker">register</button>)
    </div>
	</footer>
</template>

<script>
import draggable from "vuedraggable";
import Button from "./Button.vue";
import jsPDF from "jspdf";
import items from "../store/items";

const TEXT_LENGTH_MAX = 144;
const TEXT_LENGTH_PREVIEW = 19;
const TEXT_SIZE_DEFAULT = 22;
const TEXT_FAMILY = "ComicNeueBold";

export default {
  name: "DayPlanner",
  components: {
    draggable,
    Button
  },
  data() {
    return {
      itemsAvailable: items,
      itemsSelected: [],
      layoutSelected: "",
      loadingIndicator: false,
      layouts: [
        {
          id: "a4-6",
          preview: require("@/assets/layouts/A4-6.png"),
          description: "A4 Format mit sechs Bildern.",
          checked: true,
          page: {
            format: "a4",
            orientation: "portrait",
            fontSize: 22,
            textMarginTop: 10
          },
          item: {
            width: 40 * 2,
            height: 30 * 2,
            positions: [
              { x: 20, y: 15 },
              { x: 110, y: 15 },
              { x: 20, y: 100 },
              { x: 110, y: 100 },
              { x: 20, y: 180 },
              { x: 110, y: 180 }
            ]
          },
          logos: [
            {
              x: 20,
              y: 270,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: "PNG"
            },
            {
              x: 125,
              y: 270,
              width: 55,
              height: 16,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: "PNG",
              link: "https://www.lakos-sachsen.de/"
            }
          ]
        },
        {
          id: "a4-4",
          preview: require("@/assets/layouts/A4-4.png"),
          description: "A4 Querformat mit vier Bildern.",
          checked: false,
          page: {
            format: "a4",
            orientation: "landscape",
            fontSize: 24,
            textMarginTop: 12
          },
          item: {
            width: 40 * 4 - 22 * 2,
            height: 30 * 4 - 22 * 2,
            positions: [
              { x: 25, y: 10 },
              { x: 155, y: 10 },
              { x: 25, y: 95 },
              { x: 155, y: 95 }
            ]
          },
          logos: [
            {
              x: 23,
              y: 185,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: "PNG"
            },
            {
              x: 212,
              y: 183,
              width: 55,
              height: 16,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: "PNG",
              link: "https://www.lakos-sachsen.de/"
            }
          ]
        },
        {
          id: "a4-2",
          preview: require("@/assets/layouts/A4-2.png"),
          description: "A4 Format mit zwei großen Bildern.",
          checked: false,
          page: {
            format: "a4",
            orientation: "portrait",
            fontSize: 36,
            textMarginTop: 20
          },
          item: {
            width: 180,
            height: 120,
            positions: [
              { x: 15, y: 15 },
              { x: 15, y: 140 }
            ]
          },
          logos: [
          {
              x: 20,
              y: 270,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: "PNG"
            },
            {
              x: 136,
              y: 270,
              width: 55,
              height: 16,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: "PNG",
              link: "https://www.lakos-sachsen.de/"
            }
          ]
        }
      ],
      version: ""
    };
  },
  computed: {
    /**
     * @returns {boolean} true, if the web share API is supported
     */
    isShareable() {
      return "share" in navigator;
    },
    /**
     * @returns {Boolean} true if it is not in a iframe or false if it is in a iframe
     */
    isNotInIframe() {
      return window.top === window.self;
    },
    /**
     * @returns {Boolean} true if application runs in a PWA context
     */
    isPwa() {
      return window.matchMedia("(display-mode: standalone)").matches;
    }
  },
  methods: {
    async shareViaWebShare() {
      try {
        const shareData = {
          title: process.env.VUE_APP_TITLE || "KiTa Tagesplaner",
          text:
            "Meine Empfehlung: Ein Tool zum Erstellen von Tagesplänen für KiTas mit beschreibenden Illustrationen.",
          url: `${window.location.protocol}//${window.location.hostname}`
        };
        await navigator.share(shareData);
        this.showToastMessage(
          "Die Adresse wurde geteilt. Vielen Dank für´s Weitersagen!",
          "success",
          14400
        );
      } catch (err) {
        this.showToastMessage(
          "Sie haben die Anwendung nicht geteilt.",
          "warning",
          14400
        );
        console.error(err);
      }
    },

    /**
     * Truncate a string to a given length.
     * @param {String} text to truncate
     * @param {Number} length to truncate to
     * @returns {String} suffix to append to the truncated string
     * @private
     * @memberof DayPlanner
     */
    filterTruncate(text, length, suffix) {
      length = length || TEXT_LENGTH_PREVIEW;
      suffix = suffix || "…";
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },

    /**
     * Check length of text.
     * @param {String} text
     * @returns {String} With a warning if text is too long.
     * @private
     * @memberof DayPlanner
     */
    checkTextfieldLength(text) {
      if (text.length >= TEXT_LENGTH_MAX) {
        return `<span class="text-warning" title="Der Text hat die maximale Länge erreicht. Wenn Sie mehr schreiben wollen, legen Sie ein neues Textfeld an!">${text.length} / ${TEXT_LENGTH_MAX}</span>`;
      } else {
        return `${text.length} / ${TEXT_LENGTH_MAX}`;
      }
    },

    /**
     * Add textfield to selected items.
     * @returns {void}
     * @private
     * @memberof DayPlanner
     */
    addTextfield() {
      this.itemsSelected.push({
        id: "t",
        type: "text",
        open: "open",
        text: "",
        placeholder: "Hier den Text eingeben",
      });
    },

    /**
     * Create the PDF.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    createDocument() {
      this.loadingIndicator = true;

      // Define file name
      const itemIds = this.itemsSelected.map(item => item.id);
      const filename = `tagesplaner_${this.layoutSelected.id}_${itemIds.join(
        "-"
      )}.pdf`;

      // Create a new document
      const doc = new jsPDF({
        unit: "mm",
        putOnlyUsedFonts: true,
        orientation: this.layoutSelected.page.orientation || "portrait",
        format: this.layoutSelected.page.format || "a4"
      });

      // Set document properties
      doc.setProperties({
        title: "KiTa Tagesplaner",
        subject: "KiTa Tagesplaner mit Bildern",
        author:
          "Landeskompetenzzentrum zur Sprachförderungan Kindertageseinrichtungen in Sachsen(LakoS)",
        keywords: "KiTa,NULLzuEINS,Tagesplaner",
        creator:
          "Landeskompetenzzentrum zur Sprachförderungan Kindertageseinrichtungen in Sachsen(LakoS)"
      });

      // Add custom fonts to the document
      doc.addFont(
        require(`@/assets/fonts/ComicNeue/ComicNeue-Bold.ttf`),
        "ComicNeueBold",
        "normal"
      );

      // Draw a line at the bottom of the page
      doc.line(
        17,
        doc.internal.pageSize.height - 30,
        doc.internal.pageSize.width - 17,
        doc.internal.pageSize.height - 30
      );

      // Add logos on the first page
      this.layoutSelected.logos.forEach(logo => {
        // Add logo
        doc.addImage(
          logo.url,
          logo.type,
          logo.x,
          logo.y,
          logo.width,
          logo.height
        );
        // If logo has a link, add a link to the PDF
        if (logo.link) {
          // Add a link to the PDF
          doc.link(logo.x, logo.y, logo.width, logo.height, {
            url: logo.link,
            target: "_blank"
          });
        }
      });

      // Add link to url in footer
      doc.setFont("ComicNeue");
      doc.setFontSize(7);
      doc.setTextColor(12, 12, 200);
      doc.textWithLink(
        `www.lakos-sachsen.de`,
        doc.internal.pageSize.width - 60,
        doc.internal.pageSize.height - 10,
        {
          url: "https://www.lakos-sachsen.de/",
          target: "_blank"
        }
      );

      // Add two images on every page.
      let itemsOnPage = 0;
      this.itemsSelected.forEach(async (item, index) => {
        const position = this.layoutSelected.item.positions[itemsOnPage];
        if (item.type === "image") {
          // Add image to page
          doc.addImage(
            require(`@/assets/images/${item.filename}`),
            "JPEG",
            position.x,
            position.y,
            this.layoutSelected.item.width,
            this.layoutSelected.item.height
          );
        } else if (item.type === "text") {
          // Add text to page
          doc.setFontSize(
            this.layoutSelected.page.fontSize || TEXT_SIZE_DEFAULT
          );
          doc.setFont(TEXT_FAMILY);
          doc.setDrawColor(42, 42, 42);
          doc.setTextColor(0, 0, 0);
          doc.text(
            position.x,
            position.y + this.layoutSelected.page.textMarginTop,
            item.text,
            { maxWidth: this.layoutSelected.item.width }
          );
        }

        // Count items on page
        itemsOnPage++;

        // Add page if all images are added per page if it is not the last page
        if (
          itemsOnPage === this.layoutSelected.item.positions.length &&
          index < this.itemsSelected.length - 1
        ) {
          doc.addPage();

          // Draw a line at the bottom of the page
          doc.line(
            17,
            doc.internal.pageSize.height - 30,
            doc.internal.pageSize.width - 17,
            doc.internal.pageSize.height - 30
          );

          // Add logos on the following pages
          this.layoutSelected.logos.forEach(logo => {
            // Add logo
            doc.addImage(
              logo.url,
              logo.type,
              logo.x,
              logo.y,
              logo.width,
              logo.height
            );
            // If logo has a link, add a link to the PDF
            if (logo.link) {
              doc.link(logo.x, logo.y, logo.width, logo.height, {
                url: logo.link,
                target: "_blank"
              });
            }
          });

          itemsOnPage = 0;
        }
      });

      // Print PDF if the browser supports it on production environment
      if (["staging", "production"].includes(process.env.NODE_ENV)) {
        doc.autoPrint();
      }

      // Save the PDF
      doc.save(filename, { returnPromise: true }).then(
        () => {
          // Deactivate loading indicator
          this.loadingIndicator = false;
          // Show success message
          this.showToastMessage(
            "Das Dokument zum Drucken wurde erstellt.",
            "success",
            14400
          );
        },
        error => {
          // Deactivate loading indicator
          this.loadingIndicator = false;
          // Show error message
          this.showToastMessage(error.message, "error");
        }
      );
    },

    /**
     * Show toast message.
     * @param {String} message
     * @param {String} type
     * @param {Number} duration
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    showToastMessage(message, type, duration) {
      this.$toast.open({
        message,
        type,
        duration: duration || 8000,
        position: "top-right"
      });
    },

    /**
     * Add item to selected items.
     * @param {Object} item
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
     storeAddItem(item) {
      this.itemsSelected.push(item);
      this.storeSetSettings();
    },

    /**
     * Loads settings from local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     * @todo Check if local storage is available
     */
    storeRemoveFromSelected(index) {
      this.itemsSelected.splice(index, 1);
      this.storeSetSettings();
    },

    /**
     * Loads settings  from local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     * @todo Check if local storage is available
     */
    storeGetSettings() {
      if (window.localStorage.itemsSelected) {
        this.itemsSelected = JSON.parse(window.localStorage.itemsSelected);
      }
      if (window.localStorage.layoutSelected) {
        this.layoutSelected = JSON.parse(window.localStorage.layoutSelected);
      }
    },

    /**
     * Persists settings in local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     * @todo Check if local storage is available
     */
    storeSetSettings: function() {
      window.localStorage.itemsSelected = JSON.stringify(this.itemsSelected);
      window.localStorage.layoutSelected = JSON.stringify(this.layoutSelected);
    },

    /**
     * Deletes settings from local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    storeRemoveSettings() {
      window.localStorage.removeItem("itemsSelected");
      this.itemsSelected = [];
      window.localStorage.removeItem("layoutSelected");
    },

    /**
     * Loads version number from package.json or from local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    storeGetVersion() {
      if (window.localStorage.version) {
        return (this.version = window.localStorage.version);
      } else {
        return (this.version = "1.8.0");
      }
    },

    /**
     * Set version number in local storage.
     */
    storeSetVersion() {
      window.localStorage.version = process.env.VUE_APP_VERSION;
    },

    /**
     * Selects a layout.
     * @param {Object} layout
     * @param {Number} index
     * @returns {void}
     * @private
     * @memberof DayPlanner
     */
    storeSetLayout(layout) {
      this.layouts.forEach(l => {
        l.checked = false;
      });
      layout.checked = true;
      this.layoutSelected = layout;
      this.storeSetSettings();
    },

    /**
     * Get layout from local storage or use default layout.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    storeGetLayout() {
      if (window.localStorage.layoutSelected) {
        // Set checked property of layout to true on layoutSelected
        this.layouts.forEach(l => {
          if (l.name === this.layoutSelected.name) {
            l.checked = true;
          } else {
            l.checked = false;
          }
        });
        this.layoutSelected = JSON.parse(window.localStorage.layoutSelected);
      } else {
        // Find default layout with check = true
        this.layoutSelected = this.layouts.find(layout => {
          return layout.checked;
        });
      }
      // Force update
      this.$forceUpdate();
    },

    /**
     * Unregister service worker.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    unregisterServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    },

    /**
     * Update service worker.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    updateServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          registration.update();
        });
      }
    },

    /**
     * Register service worker.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js");
      }
    },

    /**
     * Check if service worker is available.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    checkServiceWorker() {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
              this.subscribed = true;
            } else {
              this.subscribed = false;
            }
          });
        });
      }
    },

    /** Compare version number from package.json and local storage.
     * @returns {Boolean}
     * @memberof DayPlanner
     * @private
     */
    checkVersionChanged() {
      // Compare version in local storage with version in package.json
      if (
        this.storeGetVersion() !== "0.0.0" &&
        this.storeGetVersion() !== process.env.VUE_APP_VERSION
      ) {
        // Show message if version in local storage is not equal to version in package.json
        this.showToastMessage(
          `Es ist ein Programmupdate war verfügbar.<br>Ihr Programm wurde automatisch aktualisiert.<br>Dabei wurden die Einstellungen zurückgesetzt.`,
          "info",
          30000
        );
        this.storeRemoveSettings();
        this.storeSetVersion();
        this.$forceUpdate();
      }
    }
  },
  created() {
    this.storeGetSettings();
    this.storeGetVersion();
    this.storeGetLayout();
    this.checkVersionChanged();
  }
};
</script>

<style lang="css">
/* :::::::::::::::::::::::::::::::::::: Alert boxes ::::::::::::::::::::::::::::::::::::::::: */
.alert {
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1.2rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.2rem;
}

.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
  padding: 1.2rem 3.25rem;
}
.alert-primary::before {
  position: absolute;
  content: "ⓘ";
  display: block;
  font-weight: 900;
  font-size: 1.7em;
  left: 0.8rem;
  top: 0.6rem;
}

/* ::::::::::::::::::::::::::::::::::: Layout selection ::::::::::::::::::::::::::::::::::: */
.layout-selector {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 0fr);
  grid-gap: 1em;
  align-items: baseline;
}

.layout-selector-item {
  display: inline;
}
/* List horizontal */
.layout-selector input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.layout-selector label {
  display: inline-block;
  background-color: var(--color-white);
  padding: 0.3em;
  border: 2px solid var(--color-gray-dark);
  border-radius: var(--border-radius-base);
  cursor: pointer;
}

.layout-selector label:hover {
  background-color: var(--color-primary);
}

.layout-selector input[type="radio"]:focus + label {
  border: 2px dashed #444;
}

.layout-selector input[type="radio"]:checked + label {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

/* :::::::::::::::::::::::::::::::::: Dayplanner :::::::::::::::::::::::::::::::::: */
.dayplanner {
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.dayplanner-row {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  gap: var(--padding-base);
}

.dayplanner-col > h3 {
  margin-left: 1.4em;
}


.dayplanner-group {
  border: 1px solid var(--color-background-item-active);
  min-height: 100px;
  min-width: 100px;
  background-color: var(--color-background);
  padding: var(--padding-base) var(--padding-base) var(--padding-xxxlg);
}

.dayplanner-group-selected {
  min-height: 87%;
}


/* ------------ Dayplanner: Item ------------ */
.dayplanner-item {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: 0fr 3fr 0fr;
  grid-template-areas: "handle title delete";
  grid-gap: var(--padding-base);
  border: 1px solid var(--color-background-item-active);
  align-items: start;

  cursor: grab;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-base);
  background-color: var(--color-background-item);
  margin-bottom: 0.25em;
}

.dayplanner-item button,
.dayplanner-item summary {
  padding: 1em 1em;
  font-size: 1rem;
  line-height: 1rem;
  color: var(--color-text);
  border: transparent solid 1px;
}

.dayplanner-item > input {
  width: 6em;
  line-height: 1;
  height: 1.8em;
  padding: 0.5em;
  border: 1px solid #ccc;
  color: var(--color-text);
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
}

.dayplanner-item-btn {
  border: var(--color-gray-light) solid 1px;
  padding: calc(1em + 12px) 1em;
  font-size: 1rem;
  background: transparent;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.dayplanner-item-btn:hover {
  background: var(--color-background-item-active);
  color: var(--color-text);
}

.dayplanner-item-btn:focus {
  border: var(--color-primary) solid 1px;
  outline: none; /* Remove default focus ring */
}

.dayplanner-item-btn:first-child {
  border-radius: var(--border-radius-base) 0 0 var(--border-radius-base);
}

.dayplanner-item-btn:last-child {
  border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
}

.dayplanner-item-btn--handle {
  grid-area: handle;
  cursor: grab;
}

.dayplanner-item-btn--add {
  background-color: var(--color-secondary);
  color: var(--color-text);
}
.dayplanner-item-btn--add:focus {
  border-color: var(--color-text);
}

.dayplanner-item-btn--delete {
  background-color: var(--color-error);
  color: var(--color-white);
  border-color: var(--color-white);
}
.dayplanner-item-btn--delete:focus {
  border-color: var(--color-text);
}

.dayplanner-item--text {
  color: var(--color-white) !important;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
}

.dayplanner-item--text button,
.dayplanner-item--text summary {
  color: var(--color-white);
  font-weight: 800;
}

.dayplanner-item--text details summary::marker {
  color: var(--color-white);
}

.dayplanner-choosen,
.dayplanner-ghost,
.dayplanner-item--grab:active {
  cursor: grabbing !important;
}

.dayplanner-ghost {
  background-color: var(--color-background-item-active);
}

/* ------------ Dayplanner: Text ------------ */
.dayplanner-text:focus {
  border: var(--color-primary) solid 1px;
}

/* ------------ Dayplanner: Summary ------------ */
.dayplanner-item summary {
  grid-area: title;
  cursor: pointer;
  line-height: 1rem;
}

.dayplanner-text summary:focus {
  outline: none;
}

.dayplanner-text summary::marker {
  color: var(--color-text);
}

.dayplanner-text summary + p {
  line-height: 1.2em;
  margin-top: 0;
  padding: 0;
}

.dayplanner-text summary + p img {
  max-width: 100%;
  height: auto;
}

.dayplanner-text summary + p textarea {
  display: block;
  width: 80%;
  height: 100%;
  outline: none;
  resize: none;
  border: dashed var(--color-text-inverted) 1px;
  border-radius: var(--border-radius-base);
  background-color: transparent;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.5em;
  margin: 0.5em var(--padding-base);
}

.dayplanner-text summary + p textarea:focus {
  border-color: var(--color-primary);
}

/* ------------ Small devices ------------ */
@media screen and (max-width: 912px) {
  .dayplanner-row {
    grid-gap: 0.3em;
    grid-template-columns: 50% 50%;
  }

  .dayplanner-group {
    border: none;
    padding: 0;
  }

  .dayplanner-item {
    grid-gap: 0.4em;
    grid-template-columns: 3fr 0fr;
    grid-template-areas: "title delete";
  }

  .dayplanner-item-btn--handle {
    display: none;
  }

  .dayplanner-item details {
    padding-left: 0;
    padding-right: 0;
  }

  .dayplanner-text {
    text-overflow: ellipsis;
    overflow: hidden;
  }

}
</style>
