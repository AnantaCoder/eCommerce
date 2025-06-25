import { useEffect, useState } from "react"


export const useSearch = (initialQuery="",debounceDelay=400)=>{
    const [searchQuery,setSearchQuery] = useState(initialQuery)
    const [debouncedQuery,setDebouncedQuery] = useState(initialQuery)

    useEffect(()=>{
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, debounceDelay);
        return ()=> clearTimeout(handler)


    },[debounceDelay])


    const clearSearch =()=>{
        setSearchQuery('')
        setDebouncedQuery('')
    }

return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    clearSearch
  };
}