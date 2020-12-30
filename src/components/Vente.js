import React, {useState, useEffect} from 'react';
import fire  from '../firebase/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { useParams, } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

//visualisation des statistiques des ventes des differentes marques par influenceur et par mois
const Vente = () => {

    const [purchases,setPurchases] = useState({})
    const [influencers,setInfluencers] = useState({})
    const [articles,setArticles] = useState({})
    const [brands, setBrands] = useState({})
    const [value,setValue]=useState('');

    //Récupération de paramètre dans l'url
    const { offer_id } = useParams();
    
    //La valeur du mois séléctionée
    const handleSelect=(e)=>{
      setValue(e)
    }

    useEffect(() => {
      
        const purchases = fire.database().ref('conversions/purchase');
        const influencers = fire.database().ref('Influencers');
        const articles = fire.database().ref('articles');
        const brands = fire.database().ref('brands');


        brands.on('value', snapshot => {
            if (snapshot.val() != null )
              setBrands({
                  ...snapshot.val()
              })
            })
     
        purchases.on('value', snapshot => {
            if (snapshot.val() != null )
              setPurchases({
                  ...snapshot.val()
              })
            })
         influencers.on('value', snapshot => {
            if (snapshot.val() != null )
            setInfluencers({
                  ...snapshot.val()
              })
            })

        articles.on('value', snapshot => {
            if (snapshot.val() != null )
            setArticles({
                  ...snapshot.val()
              })
            })
          
    },[] )

    //Les ventes d'une marque choisie
    var specificPurchases = Object.keys(purchases).filter(key => purchases[key].offerId == offer_id)
    //Les clé des influencers
    var influencersKey = specificPurchases.map(keys =>purchases[keys].influencer);
    //Rendre un tableau des clé des influencers avec non redondance
    const influencersUnique = [...new Set(influencersKey)];
    //Accés aux détails des influencers 
    var influencersDetail = Object.keys(influencers).filter(key => influencersUnique.includes(key));
    
    //détermination de nombre de ventre par influencer et par mois (sales Number)
    var sales= [] ; var salesNumber = []; 

    for(let i=0; i< influencersUnique.length; i++){
      sales.push(specificPurchases.filter(keys => purchases[keys].influencer === influencersUnique[i] && ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"][(new Date(purchases[keys].createdAt)).getMonth()] === value ));
    }

    salesNumber= sales.map(key => key.length);

    
    //détermination de commission par influencer et par mois
    var commission = [];var commisionFlat= [];var commisionAmount= [];
    for(let i=0; i< influencersUnique.length; i++){
      commission.push(specificPurchases.filter(keys => purchases[keys].influencer === influencersUnique[i]).map(key => purchases[key].commission));
    }
   
    let l =0;
    commisionFlat= commission.flat();

    for (let i=0; i<salesNumber.length;i++){
      let d = 0;
      commisionAmount[i] = 0
        while (d<salesNumber[i]){
          commisionAmount[i] = commisionAmount[i] + parseFloat(commisionFlat[l])
            d++;
            l++;
      }
    }

    //détermination de nombre d'articles par influencer et par mois
   var products = [];var productsNumber = []  
   var specificArticles = Object.keys(articles).filter(key => articles[key].offerId == offer_id);

   for(let i=0; i< influencersUnique.length; i++){
    products.push(specificArticles.filter(keys => articles[keys].uid === influencersUnique[i] &&
        salesNumber[i] > 0
      ));
    }

   productsNumber= products.map(key => key.length);

  //détermination de nombre de vente totale et la commission totale
   var salesNumberSum = 0; var salesAmountSum = 0
   for(let i=0; i<salesNumber.length;i++){
      salesNumberSum = salesNumberSum + salesNumber[i] 
      salesAmountSum = salesAmountSum + commisionAmount[i] 
   }

   //indice pour l'affichage
    var j = -1

    return(
    <>
      <div className="row">
        <div className="col-md-4">
            
            <img  src={ Object.keys(brands).filter(key => brands[key].offerId == offer_id).map(keys => brands[keys].pic)} alt="brandName" width="300" margin-left="-50px;" />
        </div>
        <div className="col-md-3">
            <h3>Sales Number <div>{salesNumberSum}</div> </h3>
            <h3>Sales Amount <div>{salesAmountSum.toFixed(1)} €</div> </h3>
        </div>
        <div className="col-md-5">
          <Line
            data={{
              labels : ["",`5 ${value}`,`15 ${value}`,`25 ${value}`,`30 ${value}`],
              datasets : [{
                data : []
              }]
            }}
            width={100}
            height={50}
            options={{ maintainAspectRatio: false }}  />
        </div>
      </div>

      <div className="row">    
          <div className="col-md-5">
              <h1> {Object.keys(brands).filter(key => brands[key].offerId == offer_id).map(keys =>brands[keys].name)} </h1>
          </div>
          <div className="col-md-5">
              <DropdownButton
                  alignRight
                  title="Select Month"
                  id="dropdown-menu-align-right"
                  onSelect={handleSelect}
                  >
              <Dropdown.Item eventKey="Janvier" >Janvier</Dropdown.Item>
              <Dropdown.Item eventKey="Février">Février</Dropdown.Item>
              <Dropdown.Item eventKey="Mars">Mars</Dropdown.Item>
              <Dropdown.Item eventKey="Avril">Avril</Dropdown.Item>
              <Dropdown.Item eventKey="Mai">Mai</Dropdown.Item>
              <Dropdown.Item eventKey="Juin">Juin</Dropdown.Item>
              <Dropdown.Item eventKey="Juillet">Juillet</Dropdown.Item>
              <Dropdown.Item eventKey="Août">Août</Dropdown.Item>
              <Dropdown.Item eventKey="Septembre">Septembre</Dropdown.Item>
              <Dropdown.Item eventKey="Octobre">Octobre</Dropdown.Item>
              <Dropdown.Item eventKey="Novembre">Novembre</Dropdown.Item>
              <Dropdown.Item eventKey="Décembre">Décembre</Dropdown.Item>
              </DropdownButton>
                 
          </div>
          <div className="col-md-2"><h3>{value}</h3>
          </div>
     </div>

      <div className="row">
            <div className="col-md-12">
                <table className="table table-bordless table-stripped">
                    <thead className="thead-light">
                        <tr>
                            <th>Influencers</th>
                            <th>Sales number</th>
                            <th>Commissions amount</th>
                            <th>Products number</th>
                         </tr>
                    </thead>
                    <tbody>{
                        influencersDetail.map(id =>  {
                            j++
                        return <tr>                   
                                  <td >
                                    <div className="row">
                                      <div className="col-sm-3">
                                        <img  src={influencers[id].Profil.banner} alt={influencers[id].Profil.name} width="150"/>
                                      </div>
                                      <div className="col-sm-3 offset-sm-2">   
                                        <h6> {influencers[id].Profil.name} </h6>
                                        <h6>  {influencers[id].Profil.email} </h6>
                                      </div>
                                    </div>
                                  </td>
                                  <td >{salesNumber[j]}</td>
                                  <td>{commisionAmount[j].toFixed(1)} €</td>
                                  <td>{productsNumber[j]}</td>
                                </tr>
                        })
                    }
                    </tbody>

                </table>
            </div> 
        </div>  
    </>            

    )

}
export default Vente; 