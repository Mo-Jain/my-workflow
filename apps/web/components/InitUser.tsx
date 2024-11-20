import { assignmentState } from "@/lib/store/atoms/assignment";
import { favoritesState } from "@/lib/store/atoms/favorites";
import { recentlyViewedState } from "@/lib/store/atoms/recentlyViewed";
import { userState } from "@/lib/store/atoms/user";
import { workflowState } from "@/lib/store/atoms/workflow";
import { favoriteIsLoading, favoriteItems } from "@/lib/store/selectors/favoritesSelectors";
import { userNameState } from "@/lib/store/selectors/user";
import axios from "axios";
import React, { useEffect } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil";

const BASE_URL = 'http://localhost:3001'

const InitUser = () => {
    const setUser  = useSetRecoilState(userState);
    const setFavorite = useSetRecoilState(favoritesState);
    const setRecentlyViewed  = useSetRecoilState(recentlyViewedState);
    const setWorkflow  = useSetRecoilState(workflowState);
    const setAssignment = useSetRecoilState(assignmentState);
    const user = useRecoilValue(userNameState);

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
                        name:null,
                        userId:null
                    })
                }

                setUser({
                    isLoading:false,
                    username:userRes.data.username,
                    name:userRes.data.name,
                    userId:userRes.data.userId
                })
            }
            catch(err){
                setUser({
                    isLoading:false,
                    username:null,
                    name:null,
                    userId:null
                })
            }

            try{

                const favRes = await axios.get(`${BASE_URL}/api/v1/favorite`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })
                                
                setFavorite(prevFavorites => ({
                    ...prevFavorites,
                    favorites: [...favRes.data.favoriteFolders,...favRes.data.favoriteFiles ]
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
            try{
                const workflowRes = await axios.get(`${BASE_URL}/api/v1/workflow/all`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })
                const workflowItems = workflowRes.data.workflowData;

                if(workflowItems){
                    setWorkflow({
                        isLoading:false,
                        items:workflowItems
                    })
                }
                else{
                    setWorkflow({
                        isLoading:false,
                        items:[]
                    })
                }
            }
            catch(err){
                setWorkflow({
                    isLoading:false,
                    items:[]
                })  
            }
        
            try{
                const assignmentRes = await axios.get(`${BASE_URL}/api/v1/assignment`,{
                    headers:{
                        authorization : `Bearer `+ localStorage.getItem('token')
                    }
                })
                const assignmentItems = assignmentRes.data.assignmentData;
                if(assignmentItems){
                    setAssignment({
                        isLoading:false,
                        items:assignmentItems
                    })
                }
                else{
                    setAssignment({
                        isLoading:false,
                        items:[]
                    })
                }
            }
            catch(err){
                setAssignment({
                    isLoading:false,
                    items:[]
                })
            }
        }

        init();
    }, [user])
    return <></>
};

export default InitUser;
