import * as React from 'react';
import { RouteProps } from 'react-router';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import Config from '../dm.json';
import Moment from 'react-moment';
import List from 'digimaker-ui/List';
import MetaInfo from './MetaInfo';
import Actions from 'digimaker-ui/Actions';
import Search from './Search';
import Service from '../Service';
import ViewContent from 'digimaker-ui/ViewContent';
import Registry from 'digimaker-ui/Registry';
import {ContentContext} from '../Context';
import {FetchWithAuth} from 'digimaker-ui/util';
import ReactTooltip from "react-tooltip";
import util from 'digimaker-ui/util';
import {getDefinition} from 'digimaker-ui/util';

export default class Main extends React.Component<{id:number, contenttype?:string}, { def:any, content: any, list: any, sideOpen:any }> {

    constructor(props: any) {
        super(props);
        this.state = { def:'', content: '', list: '', sideOpen: 1 };
    }


    //fetch content and set to context
    fetchData() {
        let url = '/content/get'
        if( this.props.contenttype ){
          url = url + '/'+this.props.contenttype+'/'+this.props.id;
        }else{
          url = url + '/'+this.props.id;
        }
        FetchWithAuth(process.env.REACT_APP_REMOTE_URL + url)
            .then(res => res.json())
            .then((data) => {
                this.setState({ content: data });
                let context = this.context;
                context.update(data);

                //get definition
                getDefinition(data.content_type)
                .then(data=>this.setState({def: data}));
            }).catch(err=>{
              this.setState(()=>{throw err});
            })
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate( prevProps, prevState, snapshot ){
      //when changing page
      if( prevProps.id != this.props.id)
      {
        this.fetchData();
      }
    }

    afterAction(refresh:boolean, jumpToParent: boolean){
      if(jumpToParent){
        window.location.href = '/main/'+this.state.content.parent_id; //todo: use better way for redirection.
      }
    }

    //get allowed type. (used in list types and new types configuration)
    getAllowedTypes(typeConfig:Array<string>){
      let result: Array<string> = [];
      if( typeConfig ){
        typeConfig.map((value:string)=>{
            let type = util.getAllowedType( this.state.content, value );
            if( type && !result.includes(type) ){
              result.push( type );
            }
        });
      }
      return result;
    }

    render() {
        if( !this.state.content )
        {
          return '';
        }
        let contenttype = this.state.content.content_type;
        let mainConfig = Config.main[contenttype];
        let listContenttypes: Array<string> = this.getAllowedTypes(mainConfig['list']);

        let selected = {};
        selected[this.state.content.id] = this.state.content.name;

        return (
            <div key={this.state.content.id} className={"contenttype-"+this.state.content.content_type}>
            <div className="main-top">
                <Search />
                <h2>
                  <a href="#" onClick={(e:any)=>e.preventDefault()}><i data-tip data-for="contentype" className={"icon icon-"+this.state.content.content_type}></i></a> &nbsp;
                  <ReactTooltip place="bottom" id="contentype">{this.state.def.name}</ReactTooltip>
                  {this.state.content.name} &nbsp;&nbsp;
                  {(!(contenttype=='folder'&&this.state.content.folder_type=='site'))&&<Link className="go-uppper" title="Go upper" to={'/main/'+this.state.content.parent_id}>
                  <i className="fas fa-chevron-circle-up"></i>
                  </Link>}
                </h2>
                <div>
                <i style={{fontSize:'0.85rem'}}>modified by <Link to={"/main/"+this.state.content.author}>{this.state.content.author_name}</Link> <Moment unix format="DD.MM.YYYY HH:mm">{this.state.content.modified}</Moment></i>
                &nbsp;&nbsp;<a href="#"><i data-tip data-for="metainfo"  className="fas fa-info-circle"></i></a>
                <ReactTooltip id='metainfo' clickable={true} delayShow={200} delayHide={500} place="bottom" effect='solid'>
                  <MetaInfo content={this.state.content} />
                </ReactTooltip>&nbsp;&nbsp;
                </div>
              </div>
              <div className="main-main">
                <div className="main-content">
                {/* view content */}
                {mainConfig&&mainConfig['view']&&<div className="view-content">
                    <ViewContent content={this.state.content} />
                </div>
                }

                {/* children list */}
                {listContenttypes.length>0&&
                <div className="list">
                {
                    listContenttypes.map((value)=>{
                        return(<List id={this.props.id} contenttype={value} config={Config.list[value]} />)
                    })
                }
                </div>
                }
                </div>

                {/* side area for actions */}
                {mainConfig&&mainConfig['actions']&&<div className={"side"+(this.state.sideOpen===true?' open':'')+(this.state.sideOpen===false?' closed':'')}>
                    <div className="hider"><a href="#" onClick={(e)=>{e.preventDefault();this.setState({sideOpen:!this.state.sideOpen})}}>
                       <i className="fas fa-caret-down"></i>
                    </a></div>
                    <div className="side-body">
                         {mainConfig['new']&&<div className="action-create">
                          <label>Create content</label>
                         <div>
                         {this.getAllowedTypes(mainConfig['new']).map((value:any)=>{return (
                             <Link key={value} to={`/create/${this.state.content.id}/${value}`} data-tip={value}>
                                 <i className={"icon icon-"+value}></i> &nbsp;
                             </Link>
                            )})}
                            <ReactTooltip effect="solid" />
                          </div>
                         </div>}
                        {mainConfig['new']&&<hr />}
                      {Config.main[contenttype].actions&&
                        <div className="actions">
                          <Actions from={this.state.content} selected={selected} actionsConfig={Config.main[contenttype].actions}
                            afterAction={(refresh:boolean, jumpToParent:boolean)=>this.afterAction(refresh, jumpToParent)} />
                        </div>
                      }
                    </div>
                </div>
                }
                </div>

            </div>

        );
    }
}


Main.contextType = ContentContext;
