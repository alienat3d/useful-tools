<script setup lang="ts">
import { computed, ref } from 'vue'

interface TableRow {
  id: number
  name: string
  price: number
  volume: number
  shop: string
  pricePer: number
}

const name = ref('')
const price = ref()
const measuringType = ref('')
const volume = ref()
const shop = ref('')
const tableData = ref<TableRow[]>([])
const nextId = ref(0)
let pricePer = 0

const isFormInvalid = computed(() => {
  return !name.value || !price.value || !volume.value || !measuringType.value || !shop.value
})

const dividePriceByQuantity = () => Math.round(price.value / volume.value)

const addRow = () => {
  pricePer = dividePriceByQuantity()

  tableData.value.push({
    id: ++nextId.value,
    name: name.value,
    price: price.value,
    volume: volume.value,
    shop: shop.value,
    pricePer,
  })

  price.value = null
}

const deleteRow = (id: number) => {
  tableData.value = tableData.value.filter((row) => row.id !== id)
}
</script>

<template>
  <div class="container-center mx-auto py-16 text-center">
    <h1 class="text-accent pb-8 text-3xl font-bold">Compare <span class="text-4xl">That</span></h1>
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box flex justify-center gap-x-4 border p-4"
    >
      <legend class="fieldset-legend">Add new entry</legend>
      <label class="floating-label">
        <input v-model="name" type="text" placeholder="Enter name" class="input input-md" />
        <span>Name</span>
      </label>
      <label class="floating-label">
        <input
          v-model.number="price"
          type="number"
          placeholder="Enter price"
          class="input input-md"
          min="0"
        />
        <span>Price</span>
      </label>
      <label class="floating-label">
        <span class="label">Choose Measuring</span>
        <select v-model="measuringType" class="select min-w-[120px]">
          <option value="1 piece">1 Piece</option>
          <option value="10 g">10 Gram</option>
          <option value="100 g">100 Gram</option>
          <option value="1 kg">1 Kilogram</option>
        </select>
      </label>
      <label class="floating-label">
        <input
          v-model.number="volume"
          type="number"
          placeholder="Enter volume"
          class="input input-md"
          min="0"
        />
        <span>Volume</span>
      </label>
      <label class="floating-label">
        <span class="label">Choose Marketplace</span>
        <select v-model="shop" class="select min-w-[150px]">
          <option value="Yandex Market">Yandex Market</option>
          <option value="Ozon">Ozon</option>
          <option value="Wildberries">Wildberries</option>
          <option value="AliExpress">AliExpress</option>
        </select>
      </label>
      <button
        :disabled="isFormInvalid"
        :class="isFormInvalid ? 'btn-disabled' : ''"
        @click="addRow()"
        class="btn btn-accent"
      >
        Add
      </button>
    </fieldset>
    <div
      v-if="tableData.length === 0"
      className="w-full bg-gray-600 rounded-lg shadow-md p-8 text-center text-gray-100"
    >
      No data yet. Add some entries using the form above.
    </div>
    <table v-else class="table-zebra mt-10 table">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Price</th>
          <th>per {{ measuringType }}</th>
          <th>Marketplace</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in tableData" :key="idx">
          <th>{{ row.id }}</th>
          <td>{{ row.name }}</td>
          <td>{{ row.price }}</td>
          <td>{{ row.pricePer }}</td>
          <td>{{ row.shop }}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <button
              @click="() => deleteRow(row.id)"
              className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <router-link to="/" class="btn btn-lg btn-primary mt-10">Go back to home</router-link> -->
  </div>
</template>

<style scoped></style>
