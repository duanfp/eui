import * as React from 'react';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';
import { Link, Redirect } from "react-router-dom";
import Config from '../config.json';
import LoadFields from '../ui/LoadFields';

export default class Edit extends React.Component<RouteProps, {content:any,validation:{}}> {

    constructor(props: any) {
        super(props);
        this.state = {content:'',validation:''};
    }

    fetchData(id) {
        fetch(process.env.REACT_APP_REMOTE_URL + '/content/get/'+id)
            .then(res => res.json())
            .then((data) => {
                this.setState({ content: data});
            })
    }

    componentDidMount(){
      let id = this.props.match.params.id;
      this.fetchData(id);
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const dataObject = {};
        for (let key of Array.from(form.keys())) {
            dataObject[key] = form.get(key);
        };
        fetch(process.env.REACT_APP_REMOTE_URL + '/content/update/'+this.props.match.params.id, {
            method: 'POST',
            body: JSON.stringify(dataObject),
        }).then((res) => {
            if (res.ok) {
                this.props.history.push('/main/' + this.state.content.parent_id);
                //todo: use redirect parameters
            }else {
                console.log(res)
                return res.json();
            }
        }).then((data)=>{
            this.setState( {validation: data} )
        });;
    }

    render() {
        if( !this.state.content ){
          return (<div className="loading" />)
        }

        let data:any = {};
        let content = this.state.content;
        Object.keys(content).map((key)=>{
          if( content[key].Raw != undefined ){
            data[key] = content[key].Raw;
          }
        });
        return (<div className="container-new">
            <div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <div className="form-tool">
                        <div className="form-actions">
                            <div className="block-title">Actions</div>
                            <div className="block-body">
                                <div>
                                    <button type="submit" className="btn btn-primary btn-sm"><i className="fas fa-paper-plane"></i> Submit</button>
                                </div>
                                <div>
                                    <Link to={`/main/${this.props.match.params.parent}`}>
                                        <button type="button" className="btn btn-sm btn-secondary">
                                            <i className="fas fa-window-close"></i> Cancel
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="form-main">
                        <h2></h2>
                        <LoadFields type={content.content_type} data={data} validation={this.state.validation}  />
                    </div>
                </form>
            </div>
        </div>)
    }
}