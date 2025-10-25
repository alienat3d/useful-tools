<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Dates {
  name: string
  birthday: string
  'acquaintance-anniversary': string
  'wedding-anniversary': string
  photo: string
}

const dates = ref<Dates[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

// Function to extract month and day for comparison
const getMonthDay = (birthday: string) => {
  const parts = birthday.split('-')

  if (parts[0] === '' && parts[1] === '') {
    return { month: parseInt(parts[2] ?? '0'), day: parseInt(parts[3] ?? '0') }
  } else {
    return { month: parseInt(parts[1] ?? '0'), day: parseInt(parts[2] ?? '0') }
  }
}

// Format date as "2nd January"
const formatDate = (birthday: string) => {
  const parts = birthday.split('-')
  let day: number
  let month: number

  if (parts[0] === '' && parts[1] === '') {
    // Format: "--MM-DD"
    month = parseInt(parts[2] ?? '0')
    day = parseInt(parts[3] ?? '0')
  } else {
    // Format: "YYYY-MM-DD"
    month = parseInt(parts[1] ?? '0')
    day = parseInt(parts[2] ?? '0')
  }

  // Array of month names
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinal = (n: number): string => {
    const suffixes: Record<number, string> = { 1: 'st', 2: 'nd', 3: 'rd' }
    const v = n % 100
    const suffix = suffixes[v % 10] && (v % 100) - (v % 10) !== 10 ? suffixes[v % 10] : 'th'
    return `${n}${suffix}`
  }

  return `${getOrdinal(day)} ${monthNames[month - 1]}`
}

// Calculate age (only if year is available)
const calculateAge = (birthday: string) => {
  const parts = birthday.split('-')

  // Check if year is missing (format: "--MM-DD")
  if (parts[0] === '' || parts[0] === undefined) {
    return null // No year available
  }

  const birthYear = parseInt(parts[0])
  const currentYear = new Date().getFullYear()

  return currentYear - birthYear + 1
}

// Sorted persons by month and day
const sortedPersons = computed(() => {
  if (!Array.isArray(dates.value)) {
    return []
  }

  return [...dates.value].sort((a, b) => {
    const dateA = getMonthDay(a.birthday)
    const dateB = getMonthDay(b.birthday)

    if (dateA.month !== dateB.month) {
      return dateA.month - dateB.month
    }

    return dateA.day - dateB.day
  })
})

onMounted(async () => {
  try {
    const response = await fetch('/db/dates-reminder-db.json')
    const data = await response.json()

    if (data.persons) {
      dates.value = data.persons
    } else if (Array.isArray(data)) {
      dates.value = data
    } else {
      throw new Error('Unexpected data format')
    }
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Failed to load data'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1 class="text-accent pb-8 text-center text-3xl">
      Dates <span class="text-4xl">Reminder</span>
    </h1>
    <div v-if="isLoading"><span class="loading loading-spinner text-accent"></span></div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else class="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      <li v-for="(item, idx) in sortedPersons" :key="item.name" class="min-h-32">
        <!-- Even index (0, 2, 4, ...) -->
        <template v-if="idx % 2 === 0">
          <div class="timeline-start mb-10 md:text-end">
            <time class="font-mono italic">{{ formatDate(item.birthday) }}</time>
            <div class="text-lg font-black">
              {{ item.name }}
              <span v-if="calculateAge(item.birthday)" class="text-md"
                >turns {{ calculateAge(item.birthday) }}</span
              >
            </div>
          </div>
          <div class="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="timeline-end"></div>
        </template>

        <!-- Odd index (1, 3, 5, ...) -->
        <template v-else>
          <div class="timeline-start"></div>
          <div class="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="timeline-end mb-10">
            <time class="font-mono italic">{{ formatDate(item.birthday) }}</time>
            <div class="text-lg font-black">
              {{ item.name }}
              <span v-if="calculateAge(item.birthday)" class="text-md"
                >turns {{ calculateAge(item.birthday) }}</span
              >
            </div>
          </div>
        </template>
        <hr class="bg-[currentColor]" />
      </li>
    </ul>
  </div>
</template>
