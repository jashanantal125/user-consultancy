import { create } from "zustand";

const useStore = create((set) => ({
    sid: '', //initial state
    setSid: (newSid) => set({sid: newSid}),
    fullName: '',
    setFullName: (newName) => set({fullName: newName})
}))


export default useStore;