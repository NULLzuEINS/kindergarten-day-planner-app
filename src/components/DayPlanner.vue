<template>
<h1>Day planner</h1>
	<div class="dayplanner">
		<div class="dayplanner-row">
			<div class="dayplanner-col">
				<h3>Draggable 1</h3>
				<draggable
					class="dayplanner-group"
					:list="list1"
					group="people"
					@change="log"
					itemKey="name"
				>
					<template #item="{ element, index }">
						<div class="dayplanner-item">{{ element.name }} {{ index }}</div>
					</template>
				</draggable>
			</div>

			<div class="dayplanner-col">
				<h3>Draggable 2</h3>
				<draggable
					class="dayplanner-group"
					:list="list2"
					group="people"
					@change="log"
					itemKey="name"
				>
					<template #item="{ element, index }">
						<div class="dayplanner-item">{{ element.name }} {{ index }}</div>
					</template>
				</draggable>
			</div>

			<rawDisplayer
				:class="item"
				:value="list1"
				title="List 1"
			/>

			<rawDisplayer
				:class="item"
				:value="list2"
				title="List 2"
			/>
			
		</div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DayPlanner',
  components:  {
    draggable,
  },    
  data() {
    return {
      list1: [
        { name: "John", id: 1 },
        { name: "Joao", id: 2 },
        { name: "Jean", id: 3 },
        { name: "Gerard", id: 4 }
      ],
      list2: [
        { name: "Juan", id: 5 },
        { name: "Edgard", id: 6 },
        { name: "Johnson", id: 7 }
      ]
    };
  },
  methods: {
    add: function() {
      this.list.push({ name: "Juan" });
    },
    replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
    log: function(evt) {
      window.console.log(evt);
    }
  },
  props: {
    msg: String
  }
}
</script>


<style scoped language="scss">
.dayplanner {
	display: flex;

	&-row {
		display: flex;
		border: 1px solid #ccc;
	}
	&-col {
		flex: 1;
	}
}

</style>
