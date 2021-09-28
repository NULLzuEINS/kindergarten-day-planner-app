<template>
	<header class="dayplanner">
		<h1 class="text-center">KiTa Tagesplaner</h1>
		<p>
			Erstellen Sie einen Tagesplan für ihren Kindergarten.
			Schieben Sie dazu alle Tagespunkte von der linken- auf die rechte Seite!
			Wenn Sie fertig sind, drücken Sie auf "PDF erstellen".
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
				>
				<label
					:for="layout.id"
					@click="selectLayout(layout)"
				>
					<img
						:src="layout.preview"
						width="80"
						:title="layout.description"
						:alt="layout.description"
					></label>
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
                                        sort: false,
                                    }"
					item-key="id"
				>
					<template #item="{ element }">
						<li class="dayplanner-item">
							<button class="dayplanner-item-btn dayplanner-item-btn--handle">☰</button>
							<details class="dayplanner-text">
								<summary>{{ element.description }}</summary>
								<p>
									<img
										:src="require(`@/assets/images/${element.filename}`)"
										height="150"
										:alt="element.description"
										loading="lazy"
									/>
								</p>
							</details>
							<button class="dayplanner-item-btn dayplanner-item-btn--delete">⌫</button>
						</li>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<h3>Ausgewählte Tagespunkte</h3>
				<draggable
					class="dayplanner-group"
					ghost-class="dayplanner-ghost"
					chosen-class="dayplanner-choosen"
					:group="{
                              name: 'dayplanner',
                              put: true,
                              sort: true,
                          }"
					handle=".dayplanner-handle"
					tag="ol"
					@change="persist"
					:list="itemsSelected"
					item-key="id"
				>
					<template #item="{ element, index }">
						<li class="dayplanner-item">
							<button class="dayplanner-item-btn dayplanner-item-btn--handle">☰</button>
							<details class="dayplanner-text">
								<summary>{{ element.description }}</summary>
								<p>
									<img
										:src="require(`@/assets/images/${element.filename}`)"
										height="150"
										:alt="element.description"
										loading="lazy"
									/>
								</p>
							</details>
							<button
								@click="removeFromSelected(index)"
								class="dayplanner-item-btn dayplanner-item-btn--delete"
							>⌫</button>
						</li>
					</template>
				</draggable>
			</div>
		</div>
	</section>

	<section class="dayplanner">
		<div
			class="alert alert-primary"
			role="alert"
		>
			Das Erstellen des Dokumentes kann einige Zeit in Anspruch nehmen.
			Bitte warten Sie, bis die Seite neu geladen wird!
		</div>
		<p class="text-center">
			<button
				class="dayplanner-button"
				@click="generatePdf()"
			>🖨 Tagesplan drucken</button>
		</p>
	</section>
</template>

<script>
import draggable from "vuedraggable";
import jsPDF from "jspdf";
import images from "../store/images";

export default {
  name: "DayPlanner",
  components: {
    draggable,
  },
  data() {
    return {
      itemsAvailable: images,
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
          },
          image: {
            width: 40*2,
            height: 30*2,
            positions: [
              { x: 20, y: 15 },
              { x: 110, y: 15 },
              { x: 20, y: 100 },
              { x: 110, y: 100 },
              { x: 20, y: 180 },
              { x: 110, y: 180 },
            ]
          },
          logos: [
            {
              x: 20,
              y: 270,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: 'PNG'
            },
            {
              x: 125,
              y: 268,
              width: 64,
              height: 18,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: 'PNG'
            },
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
          },
          image: {
            width: 40 * 4 - 22 *2,
            height: 30 * 4 - 22 *2,
            positions: [
              { x: 25, y: 10 },
              { x: 155, y: 10 },
              { x: 25, y:  95  },
              { x: 155, y:  95  },
            ]
          },
          logos: [
            {
              x: 23,
              y: 185,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: 'PNG'
            },
            {
              x: 210,
              y: 183,
              width: 64,
              height: 18,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: 'PNG'
            },

          ],
        },
                {
          id: "a4-2",
          preview: require("@/assets/layouts/A4-2.png"),
          description: "A4 Format mit zwei großen Bildern.",
          checked: false,
          page: {
            format: "a4",
            orientation: "portrait",
          },
          image: {
            width: 180,
            height: 120,
            positions: [
              { x: 15, y: 15 },
              { x: 15, y: 140 },
            ]
          },
          logos: [
            {
              x: 20,
              y: 270,
              width: 45,
              height: 16,
              url: require(`@/assets/logos/logo_sachsen.png`),
              type: 'PNG'
            },
            {
              x: 125,
              y: 268,
              width: 64,
              height: 18,
              url: require(`@/assets/logos/logo_lakos.png`),
              type: 'PNG'
            },
          ]
        },

      ],
    };
  },

  methods: {
   /**
    * Selects a layout.
    * @param {Object} layout
    * @param {Number} index
    * @returns {void}
    * @private
    * @memberof DayPlanner
    */
    selectLayout(layout) {
            this.layouts.forEach((l) => {
        l.checked = false;
      });
      layout.checked = true;
      this.layoutSelected = layout;
    },

    /**
     * Generates the PDF.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     */
    generatePdf() {
      this.loadingIndicator = true;

      // Define file name
      const itemIds = this.itemsSelected.map((item) => item.id);
      const filename = `tagesplaner_${this.layoutSelected.id}_${itemIds.join('-')}.pdf`

      // Create a new document
       const  doc = new jsPDF({
        unit: 'mm',
        putOnlyUsedFonts: true,
        orientation: this.layoutSelected.page.orientation || 'portrait',
        format: this.layoutSelected.page.format || 'a4',
      });

      // Set document properties
      doc.setProperties({
        title: 'KiTa Tagesplaner',
        subject: 'KiTa Tagesplaner mit Bildern',
        author: 'Sarah Girlich',
        keywords: 'KiTa,NULLzuEINS,Tagesplaner',
        creator: 'Landeskompetenzzentrum zur Sprachförderungan Kindertageseinrichtungen in Sachsen(LakoS)',
      });

      // Set draw color to gray
      doc.setDrawColor(42, 42, 42);

      // Draw a line at the bottom of the page
      doc.line(17, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 17, doc.internal.pageSize.height - 30);

      // Add logos on the first page
      this.layoutSelected.logos.forEach((logo) => {
        doc.addImage(logo.url, logo.type, logo.x, logo.y, logo.width, logo.height);
      });

      // Add two images on every page.
      let imagesOnPage = 0;
      this.itemsSelected.forEach(async (item, index) => {
           // Add image to page
          const position = this.layoutSelected.image.positions[imagesOnPage];
          doc.addImage(
            require(`@/assets/images/${item.filename}`),
            'JPEG',
            position.x,
            position.y,
            this.layoutSelected.image.width,
            this.layoutSelected.image.height
            );
          imagesOnPage++;

          // Add page if all images are added per page if it is not the last page
          if(imagesOnPage === this.layoutSelected.image.positions.length
          && index < this.itemsSelected.length -1) {
          doc.addPage();

          // Draw a line at the bottom of the page
          doc.line(17, doc.internal.pageSize.height - 30, doc.internal.pageSize.width - 17, doc.internal.pageSize.height - 30);

          // Add logos on the following pages
          this.layoutSelected.logos.forEach((logo) => {
            doc.addImage(logo.url, logo.type, logo.x, logo.y, logo.width, logo.height);
          });


          imagesOnPage = 0;
        }
      });

      // Print PDF if the browser supports it on production environment
      if ([ 'staging', 'production' ].includes(process.env.NODE_ENV)) {
        doc.autoPrint();
      }

      // Save the PDF
      doc.save(filename, {returnPromise: true}).then(()=> {
        // Deactivate loading indicator
        this.loadingIndicator = false;
        // Show success message
        this.showToastMessage( 'Das Dokument zum Drucken wurde erstellt.', 'success', 14400);
      }, (error) => {
        // Deactivate loading indicator
        this.loadingIndicator = false;
        // Show error message
        this.showToastMessage(error.message, 'error');
      });
    },

  // Show toast message
  showToastMessage(message, type, duration) {
    this.$toast.open({
      message,
      type,
      duration: duration || 8000,
      position: 'top-right',
    })
    },
    /**
     * Persists settings in local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     * @todo Check if local storage is available
     */
    persist: function () {
      window.localStorage.itemsSelected = JSON.stringify(this.itemsSelected);
      window.localStorage.layoutSelected = JSON.stringify(this.layoutSelected);
    },

    /**
     * Loads settings from local storage.
     * @returns {void}
     * @memberof DayPlanner
     * @private
     * @todo Check if local storage is available
     */
    removeFromSelected(index) {
      this.itemsSelected.splice(index, 1);
      this.persist();
    },
  },
  mounted() {
    // Load items selected from local storage
    if (window.localStorage.itemsSelected) {
      this.itemsSelected = JSON.parse(window.localStorage.itemsSelected);
    }
    // Load layout selected from local storage
    if(window.localStorage.layoutSelected) {
      this.layoutSelected = JSON.parse(window.localStorage.layoutSelected);
    }
    // Set default layout if no layout is selected
    if (!this.layoutSelected) {
      // Select layout with checked = true
      this.layoutSelected = this.layouts.find((layout) => layout.checked);
    }
  },
};
</script>

<style lang="css" >
	/* :::::::::::::::::::::::::::::::::::: Alert boxes ::::::::::::::::::::::::::::::::::::::::: */
	.alert {
		position: relative;
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
	}

	/* List horizontal */
	.layout-selector-item {
		display: inline-block;
		margin: 0 1em;
	}

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
		padding: 0 2em;
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

	.dayplanner-group-available .dayplanner-item-btn--delete {
		visibility: hidden;
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

		cursor: draggable;
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
	}

	.dayplanner-item-btn:hover {
		background: var(--color-text-inverted);
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

	.dayplanner-item-btn--delete {
		background-color: var(--color-error);
		color: var(--color-white);
		border-color: var(--color-white);
	}
	.dayplanner-item-btn--delete:focus {
		border-color: var(--color-text);
	}

	.dayplanner-choosen,
	.dayplanner-ghost,
	.dayplanner-item--grab:active {
		cursor: grabbing !important;
	}

	.dayplanner-ghost {
		background-color: var(--color-background-item-active);
	}

	.dayplanner-text:focus {
		border: var(--color-primary) solid 1px;
	}

	.dayplanner-item summary {
		grid-area: title;
		cursor: pointer;
		line-height: 1rem;
	}
	.dayplanner-text summary:focus {
		border: var(--color-primary) solid 1px;
		outline: none;
	}

	.dayplanner-text summary::marker {
		color: var(--color-text);
	}

	.dayplanner-text summary + p {
		line-height: 1.2em;
		margin-top: 0;
		padding: 0;
		text-align: center;
	}

	.dayplanner-text summary + p img {
		max-width: 100%;
		height: auto;
	}

	.dayplanner-button {
		background-color: var(--color-primary);
		color: var(--color-text);
		font-size: 1.44rem;
		padding: var(--padding-base);
		border-radius: 0.3em;
		margin: var(--padding-base);
		border: #33333355 solid 4px;
		cursor: pointer;
	}

	.dayplanner-button:hover {
		background-color: var(--color-secondary);
		color: var(--color-text-inverted);
	}

	.dayplanner-button:active {
		background-color: var(--color-primary);
		color: var(--color-text-inverted);
	}

	/* Small devices */
	@media screen and (max-width: 750px) {
		.dayplanner-row {
			grid-gap: 0;
			grid-template-columns: 50% 50%;
		}

		.dayplanner-group {
			border: none;
			padding: 0;
		}

		.dayplanner-item {
			grid-gap: 0.4em;
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

