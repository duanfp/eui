import * as React from 'react';
import Moment from 'react-moment';

export default class MetaInfo extends React.Component<{content:any}> {




  render () {
    return (
       <div className="tool-block">
         <div className="block-title">Metainfo</div>
         <div className="block-body">
         <div>ID: {this.props.content.id}</div>
         <div>Name: {this.props.content.name}</div>
         <div>Author: {this.props.content.author}</div>
         <div>Version: {this.props.content.version}</div>
         <div>Published: <Moment unix format="DD.MM HH:mm">{this.props.content.published}</Moment></div>
         <div>Modified: <Moment unix format="DD.MM HH:mm">{this.props.content.modified}</Moment></div>
         <div>Status: <span className={"status-"+this.props.content.content_type+" status-"+this.props.content.status}></span></div>
         <div>CID: {this.props.content.cid}</div>
         <div>UID: {this.props.content.uid}</div>
         </div>
       </div>
    );
  }
}
