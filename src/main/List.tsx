import * as React from 'react';
import Moment from 'react-moment';
import Config from '../config.json';
import Create from '../actions/Create';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class List extends React.Component<{ id: number, contenttype: string }, { content: any, list: any, actionNew: boolean }> {

    constructor(props: any) {
        super(props);
        this.state = { content: '', list: '', actionNew: false };
    }


    fetchData(id) {
        fetch(Config.remote_server + '/content/list/' + id)
            .then(res => res.json())
            .then((data) => {
                this.setState({ list: data });
            })
    }
    componentWillMount() {
        this.fetchData(this.props.id);
    }


    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps.id);
    }

    renderList(list) {
        let rows: Array<any> = [];
        for (let i = 0; i < list.length; i++) {
            var item = list[i]
            rows.push(<tr><td><input type="checkbox" /></td><td>{item.id}</td><td className="content-name"><span><a href="#">{item.name}</a></span></td><td>Chen</td><td><Moment unix format="DD.MM.YYYY HH:mm">{item.modified}</Moment></td><td><Moment unix format="DD.MM.YYYY HH:mm">{item.published}</Moment></td><td className="list-tool">
                <a href="/admindesign/content/view/120" className="action" title="Edit"><i className="far fa-edit"></i></a>&nbsp;
            <a href="/content/delete/76" className="action" title="Remove"><i className="far fa-trash-alt"></i></a>&nbsp;
             <a href="#" className="action" title="More"><i className="fas fa-ellipsis-h"></i></a>
            </td></tr>)
        }
        return rows;
    }

    renderAList(data) {
        return (<div>
            <h3>{this.props.contenttype}({data.length})</h3>
            <table className="table">{this.renderList(data)}</table>
        </div>
        )
    }

    newContent = () => {
        this.setState({ actionNew: true });
    }



    render() {
        if( !this.state.list[this.props.contenttype] ){
            return '';
        }
        return (
            <div>
                <div className="content-list-tools">
                     <Link to={`/create/${this.props.id}/article`} className="btn btn-link btn-sm">
                        <i className="fas fa-plus-square"></i> New
                     </Link>

                    <a href="/content/new/frontpage/1" className="btn btn-link btn-sm">
                     <input type="checkbox" value="" />
                        &nbsp;All
     </a>
                    <a href="#" className="btn btn-link btn-sm" title="Move"><i className="fas fa-cut"></i> Move</a>
                    <a href="/content/export/76" className="btn btn-link btn-sm" title="Export"><i className="fas fa-file-export"></i> Export</a>
                    <a href="/content/delete/76" className="btn btn-link btn-sm" title="Remove"><i className="far fa-trash-alt"></i> Delete</a>
                    <a href="/content/delete/76" className="btn btn-link btn-sm" title="Remove"><i className="fas fa-filter"></i> Filter</a>
                    <span>
                        <i className="fas fa-sort-alpha-up"></i> &nbsp;
<select className="form-control">
                            <option>Published</option>
                            <option>Modified</option>
                        </select>
                    </span>
                </div>
                {this.renderAList(this.state.list[this.props.contenttype])}
            </div>
        );
    }
}