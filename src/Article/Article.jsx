import React from "react";
import axios from 'axios';

class Article extends React.Component{

	constructor(props){
    super(props);
    this.state={
      articles:[]
    }
    this.callingApi();
    this.articlesGlobal= this.articlesGlobal.bind(this);
	}

	callingApi(){
    	axios.get(`/api/ressources`)
    	.then(data=>{
		 	console.log(data);
			this.setState({articles:data.data});
			console.log(this.state.articles);
		 });
		}

	articlesGlobal(){
         return this.state.articles.map((article, i )=>{
              return(
              <div key={i} className="cards">
                <img className="img" src={article.images} alt="img"/>
                <h2 className="title">{article.name}</h2>
                <p className="desc">{article.description}</p>
                <p className="date"> publication: {article.date}</p>
                <button>en savoir plus</button>
             </div>
             )
          })
      }



	render(){
			
		return(
			<div className="wrapArticle">
				<h1> TOUS LES ARTICLES DU BLOG</h1>
				<div className="article" style={{display:"flex", flexFlow:"row wrap", justifyContent:"center"}}>
					{this.articlesGlobal()}
				</div>
			</div>
		)
	}
}
export default Article;