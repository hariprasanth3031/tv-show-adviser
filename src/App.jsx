import { useEffect, useState } from "react";
import { TVShowApi } from "./api/tv_shows";
import s from "./style.module.css"
import { BG_DROP_URL} from "./config.js"
import { TvShowDetails } from "./components/TV_Show_Details/Tvshowdetails";
import { Logo } from "./components/Logo/Logo";
import logoImg from "./assets/images/Logo.png";
import { TvShowList } from "./components/TV_Show_List/TvShowList";
import { SearchBar } from "./components/SearchBar/SearchBar";

export function App(){

    const[currentTVShow, setCurrentTVShow] = useState();  
    
    const[recommendationList, setRecommendationList] = useState([]);

    console.log(currentTVShow)
    
    async function fetchPopular(){
        try{
            const popularTVShow = await TVShowApi.fetchPopular();
            if(popularTVShow.length > 0){
                setCurrentTVShow(popularTVShow[0]);
            }
        }
        catch{
            alert("Something went wrong while fetching popular shows");
        }
    }

    async function fetchRecommendation(tvShowId){
        try{
            const  recommendationListResp = await TVShowApi.fetchRecommendedShows(tvShowId);
            if(recommendationListResp.length > 0){
                setRecommendationList(recommendationListResp.slice(0,10));
            }
        }
        catch{
            alert("Something went wrong while fetching recommended shows");
        }
        
    }


    async function fetchByTitle(title){
        try{
            const  fetchByTitleResp = await TVShowApi.fetchByTitle(title);
            if(fetchByTitleResp.length > 0){
           setCurrentTVShow(fetchByTitleResp[0 ])
        }
        }
        catch{
            alert("Something went wrong while searching shows");
        }
    }

    useEffect(() => 
    {
        fetchPopular();
    }, []);

    useEffect(() => 
    {
        if(currentTVShow){
            fetchRecommendation(currentTVShow.id);
        }
        
    }, [currentTVShow]);

    function updateCurrentTVShow(tvShow){
        setCurrentTVShow(tvShow)
    }

   console.log(recommendationList)
      
    return (
       <div className={s.main_container}
            style = {{
                background: currentTVShow ?
                `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url("${BG_DROP_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
                : "black"
                }}>
            <div className={s.header}>
                <div className="row">
                    <div className="col-4">
                        <Logo
                            title="Watowatch"
                            subtitle="Find a show you may like"
                            image={logoImg}
                        />
                    </div>
                    <div className="col-md-12 col-lg-4">
                        <SearchBar  onSubmit = {fetchByTitle}/> 
                    </div>
                </div>
            </div>
            <div className={s.tv_show_details}>
                {currentTVShow && <TvShowDetails tvShow = {currentTVShow} />}
            </div>
            <div className={s.tv_recommended_shows}>
                {currentTVShow && <TvShowList onClickItem = {updateCurrentTVShow} tvShowList = {recommendationList}/> }
            </div>
       </div> 
    );
}