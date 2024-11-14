import { favoritesState } from "@/lib/store/atoms/favorites";
import { recentlyViewedState } from "@/lib/store/atoms/recentlyViewed";
import { userState } from "@/lib/store/atoms/user";
import { favoriteIsLoading, favoriteItems } from "@/lib/store/selectors/favoritesSelectors";
import axios from "axios";
import React, { useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";

const BASE_URL = 'http://localhost:3001'

const InitUser = () => {
    const setUser  = useSetRecoilState(userState);
    const setFavorite = useSetRecoilState(favoritesState);
    const setRecentlyViewed  = useSetRecoilState(recentlyViewedState);
    const favorites = useRecoilValue(favoritesState);

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
                console.log("favoriteFolders :",favoriteFolders);
                console.log("favoriteFiles :",favoriteFiles);

                setFavorite(prevFavorites => ({
                    ...prevFavorites,
                    favorites: [...favoriteFolders,...favoriteFiles ]
                }));
                

                if(!favRes.data.favoriteFolders && !favRes.data.favoriteFiles){
                    setFavorite({
                        isLoading:false,
                        favorites:[]
                    })
                }
            }
            catch(err){
                setFavorite({
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
