import * as React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import { FetchWithAuth } from '../../utils/util';
import { Accordion } from 'react-bootstrap';
import {IconToggle} from '../../ui/IconToggle';

export default class Listmenu extends React.Component<{ config: any }, { data: any }> {

  constructor(props: any) {
    super(props);
    this.state = { data: '' };
  }

  fetchData() {
    FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list/' + this.props.config.root+'/folder')
      .then(res => res.json())
      .then((data) => {
        this.setState({ data: data.list });
      })

  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      this.state.data && <div className="menuitem"><Accordion defaultActiveKey="0">
          <div className="menuitem-head">
            <a href="#"><i className={this.props.config.icon}></i> {this.props.config.name}</a>
            <div className="right"><IconToggle eventKey="1" className="fas fa-chevron-right" open={false} /></div>
          </div>
          <Accordion.Collapse eventKey="1" className="menuitem-content">
            <ul className="listmenu">
            {this.state.data.map((item)=>{
              return <li><NavLink to={'/main/'+item.id}><i className={"nodeicon far icon-" + item.content_type + " " + item.folder_type}></i>{item.name}</NavLink></li>
            })}
            </ul>
          </Accordion.Collapse>
            </Accordion>
      </div>
    );
  }
}