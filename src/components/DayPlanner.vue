<template>
	<h1 class="text-center">KiTa Tagesplaner</h1>
	<p>Erstellen Sie einen Tagesplan für ihren Kindergarten. Schieben Sie dazu alle Tagespunkte von der linken- auf die rechte Seite! Wenn sie fertig sind, drücken Sie auf "PDF erstellen".</p>

	<section class="dayplanner">
		<h2>Wählen sie ein Layout</h2>

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
				<label :for="layout.id">
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
		<h2>Wählen sie die Tagesordnungspunkte</h2>
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
					group="dayplanner"
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

	<button
		class="dayplanner-button text-center"
		@click="generatePdf()"
	>Tagesplaner drucken</button>
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
      layouts: [
        {
          id: "a4-2",
          preview: require("@/assets/layouts/A4-2.png"),
          description: "A4 Format mit zwei großen Bildern.",
          checked: true,
          width: 210,
          height: 297,
          margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
        {
          id: "a4-4",
          preview: require("@/assets/layouts/A4-4.png"),
          description: "A4 Querformat mit vier Bildern.",
          width: 297,
          height: 420,
          margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
        {
          id: "a4-6",
          preview: require("@/assets/layouts/A4-6.png"),
          description: "A4 Format mit sechs Bildern.",
          width: 420,
          height: 595,
          margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          },
        },
      ],
    };
  },
  methods: {
    generatePdf: function () {
      const itemIds = this.itemsSelected.map((item) => item.id);
      const filename = `tagesplaner_${itemIds.join('-')}.pdf`
      const doc = new jsPDF();
      doc.setProperties({
        title: 'KiTa Tagesplaner',
        subject: 'KiTa Tagesplaner mit Bildern',
        author: 'Sarah Girlich',
        keywords: 'KiTa,NULLzuEINS,Tagesplaner',
        creator: 'Landeskompetenzzentrum zur Sprachförderungan Kindertageseinrichtungen in Sachsen(LakoS)'
      });

      // Add two images on every page.
      this.itemsSelected.forEach(async (item, index) => {
        // if index is odd
        if (index % 2 === 0) {
         // Add header image
        doc.addImage(
            require(`@/assets/logos/logo_lakos.png`),
            "PNG",
            135,
            7,
            64,
            18
          );

        // Add footer image
        doc.addImage(
          require(`@/assets/logos/logo_sachsen.png`),
          "PNG",
          15,
          doc.internal.pageSize.height - 26,
          50,
          14
        );
        }

        let top = 28;
        if (index % 2 !== 0) {
           top = 150
        }
        doc.addImage(
          require(`@/assets/images/${item.filename}`),
          "JPEG",
          15,
          top,
          180,
          120
        );
        if (index % 2 !== 0 && index !== this.itemsSelected.length - 1) {
          doc.addPage();

        }
      });
      // Save the PDF
      doc.save(filename);
      // Return the PDF as a blob
      doc.output("blob");
    },
    persist: function () {
      localStorage.itemsSelected = JSON.stringify(this.itemsSelected);
    },
    removeFromSelected(index) {
      this.itemsSelected.splice(index, 1);
      this.persist();
    },
  },
  mounted() {
    if (window.localStorage.itemsSelected) {
      this.itemsSelected = JSON.parse(window.localStorage.itemsSelected);
    }
  },
};
</script>

<style lang="css" >
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
		padding: 0 1rem;
	}

	.dayplanner-row {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
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

	.dayplanner-item {
		display: grid;
		grid-template-columns: 0fr 3fr 0fr;
		grid-template-areas: "handle title delete";
		gap: 1em;
		align-items: start;

		cursor: draggable;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-base);
		background-color: var(--color-background-item);
		margin-bottom: 0.25em;
	}

	.dayplanner-group-available .dayplanner-item-btn--delete {
		visibility: hidden;
	}

	.dayplanner-item button,
	.dayplanner-item details {
		padding: 1em 1em;
		font-size: 1rem;
		line-height: 1rem;
		color: var(--color-text);
		border: transparent solid 1px;
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
	.zzzdayplanner-item--grab {
		cursor: grab;
	}

	.zzz-dayplanner-group-available {
		display: grid;
		grid-template-columns: 1fr max-content 1fr 1fr;
		grid-template-rows: 4rem;
		grid-column-gap: 10px;
		grid-row-gap: 10px;
	}

	.zzz-dayplanner-group-available .dayplanner-item {
		grid-area: 1 / 4 / 2 / 5;
	}

	.dayplanner-choosen .dayplanner-handle::before {
		background-color: inherit;
	}

	.dayplanner-choosen .dayplanner-handle::before:active {
		background-color: inherit;
	}

	.dayplanner-choosen,
	.dayplanner-ghost,
	.dayplanner-item--grab:active {
		cursor: grabbing !important;
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

	.dayplanner-ghost {
		background-color: var(--color-background-item-active);
	}

	.zzzdayplanner-handle::before:active {
		cursor: grabbing;
	}

	.zzzdayplanner-handle::before {
		content: "☰";
		position: absolute;
		top: 0;
		left: 0;
		cursor: grab;
		border: var(--color-gray) solid 1px;
		border-radius: var(--border-radius-base) 0 0 var(--border-radius-base);
		background-color: var(--color-background-item-active);
		line-height: 3em;
		width: 3em;
	}

	.zzzdayplanner-handle:hover::before {
		background-color: var(--color-gray-light-dark);
		color: var(--color-white);
	}

	.zzzdayplanner-delete::after {
		content: "⌫";
		position: absolute;
		top: 0;
		right: 0;
		padding: var(--padding-md);
		line-height: 3em;
		border: var(--color-gray) solid 1px;
		border-radius: 0 var(--border-radius-base) var(--border-radius-base) 0;
		color: var(--color-error);
		font-weight: 900;
		background-color: #ea333322;
		width: 3em;
	}

	.zzzdayplanner-delete:hover::after {
		background-color: var(--color-error);
		color: var(--color-white);
		cursor: pointer;
	}

	.dayplanner-text {
		line-height: 2.15em;
	}

	.dayplanner-text summary::marker {
		color: var(--color-text);
		cursor: pointer !important;
	}
	.dayplanner-text summary + p {
		line-height: 1.2em;
		outline: var(--color-gray-dark-dark) dotted 1px;
		outline-offset: 0.6em;
		margin-top: 1.8em;
		text-align: center;
	}

	.dayplanner-button {
		background-color: var(--color-primary);
		color: var(--color-text);
		font-size: large;
		font-weight: bold;
		padding: var(--padding-base);
		border-radius: 6px;
		margin: var(--padding-base);
		border: #33333355 solid 4px;
		cursor: pointer;
	}

	.dayplanner-button:hover {
		background-color: var(--color-secondary);
	}

	.dayplanner-button:active {
		background-color: var(--color-tertiary);
	}

	/* breakpoint for iphone 12 */
	@media screen and (max-width: 576px) {
		.dayplanner {
			font-size: 70%;
		}
		.dayplanner-row {
			gap: 0;
		}
		.dayplanner-group {
			border: none;
			padding: 0;
		}
		.dayplanner-delete::after {
			width: 3em;
		}
		.dayplanner-text {
			line-height: 1.5em;
		}
	}
</style>
