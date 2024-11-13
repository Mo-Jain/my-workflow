import { favoritesState } from "@/lib/store/atoms/favorites";
import { recentlyViewedState } from "@/lib/store/atoms/recentlyViewed";
import { userState } from "@/lib/store/atoms/user";
import axios from "axios";
import React, { useEffect } from "react"
import { useSetRecoilState } from "recoil";

const BASE_URL = 'http://localhost:3001'

const InitUser = () => {
    const setUser  = useSetRecoilState(userState);
    const setFavorites  = useSetRecoilState(favoritesState);
    const setRecentlyViewed  = useSetRecoilState(recentlyViewedState);

    useEffect(() => {

        async function init () {
            try{
                const userRes = await axios.get(`${BASE_URL}/api/v1/me`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })

                if(!userRes.data.username){
                    setUser({
                        isLoading:false,
                        username:null,
                        name:null
                    })
                }

                setUser({
                    isLoading:false,
                    username:userRes.data.username,
                    name:userRes.data.name
                })
            }
            catch(err){
                setUser({
                    isLoading:false,
                    username:null,
                    name:null
                })
            }

            try{

                const favRes = await axios.get(`${BASE_URL}/api/v1/favorite`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })
                const favoriteFolders = favRes.data.favoriteFolders.map((folder: any) =>({...folder,type:'folder'}));
                const favoriteFiles = favRes.data.favoriteFiles.map((file: any) =>({...file,type:'file'}));;
                if(favoriteFolders){
                    setFavorites({
                        isLoading:false,
                        favorites:favoriteFolders
                    })
                }
                if(favoriteFiles){
                    setFavorites({
                        isLoading:false,
                        favorites:favoriteFiles
                    })
                }

                if(!favRes.data.favoriteFolders && !favRes.data.favoriteFiles){
                    setFavorites({
                        isLoading:false,
                        favorites:[]
                    })
                }
            }
            catch(err){
                setFavorites({
                    isLoading:false,
                    favorites:[]
                })
            }

            try{

                const recentRes = await axios.get(`${BASE_URL}/api/v1/recentlyviewed`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })
                const recentlyViewedFiles = recentRes.data.recentlyViewedFiles;

                if(recentlyViewedFiles){
                    setRecentlyViewed({
                        isLoading:false,
                        items:recentlyViewedFiles
                    })
                }
                else{
                    setRecentlyViewed({
                        isLoading:false,
                        items:[]
                    })
                }
                
            }
            catch(err){
                setRecentlyViewed({
                    isLoading:false,
                    items:[]
                })
            }
        }

        init();
    }, [])
    return <></>
};

export default InitUser;
