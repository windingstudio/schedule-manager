import { createSchedule } from '../actions'

export default function NewSchedulePage() {
    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Schedule</h1>
            <form action={createSchedule} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">Date</label>
                    <div className="mt-2">
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start_time" className="block text-sm font-medium leading-6 text-gray-900">Start Time</label>
                        <div className="mt-2">
                            <input
                                type="time"
                                name="start_time"
                                id="start_time"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="end_time" className="block text-sm font-medium leading-6 text-gray-900">End Time</label>
                        <div className="mt-2">
                            <input
                                type="time"
                                name="end_time"
                                id="end_time"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="place" className="block text-sm font-medium leading-6 text-gray-900">Place</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="place"
                            id="place"
                            required
                            placeholder="e.g. City Hall A"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">Content</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="content"
                            id="content"
                            placeholder="e.g. Regular Practice, Tutti"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="note" className="block text-sm font-medium leading-6 text-gray-900">Note</label>
                    <div className="mt-2">
                        <textarea
                            name="note"
                            id="note"
                            rows={3}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Schedule
                    </button>
                </div>
            </form>
        </div>
    )
}
