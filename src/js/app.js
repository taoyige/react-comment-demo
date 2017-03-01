(function (exports, document, React, ReactDOM) {
  'use strict';

  var icons = [
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151007151721-11-1.png?x-oss-process=style/repo',
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151011005628-65-1.jpg?x-oss-process=style/repo',
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151011135942-0-1.jpg?x-oss-process=style/repo',
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151009142522-46-1.jpg?x-oss-process=style/repo',
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151009142408-2-1.jpg?x-oss-process=style/repo',
    'https://awesomes.oss-cn-beijing.aliyuncs.com/repo/151003223917-65-1.png?x-oss-process=style/repo',
  ]

  /**
   * Comment 父组件
   * 所有子组件用到数据都在父组件中得到
   * 父组件用state保存数据
   * 子组件用props得到数据
   */
  var Comment = React.createClass({
    getInitialState: function () {
      return {
        data: [],
      }
    },
    // 设置props默认值
    getDefaultProps: function () {
      return {
        // 请求间隔时间，默认2S
        intervalTime: 2000,
      }
    },
    // 从服务器加载评论信息
    loadCommentsOnServer: function () {
      $.ajax({
        url: this.props.REQUEST_URL,
        dataType: 'json',
        success: function (data) {
          this.setState({data: data});
        }.bind(this),
        error: function (e) {
          console.log(e);
        }.bind(this),
      });
    },
    // 提交评论信息
    submitCommentToServer: function (comment) {
      $.ajax({
        url: this.props.REQUEST_URL,
        method: 'POST',
        dataType: 'json',
        data: comment,
        success: function (data) {
          // console.log(data);
          this.setState({data: data});
        }.bind(this),
        error: function (e) {
          console.log(e);
        }.bind(this),
      });
    },
    // 组件挂载完成后执行
    componentDidMount: function () {
      // 一上来先执行一次
      this.loadCommentsOnServer();
      // 设置间隔请求服务器得到评论数，模拟实时更新评论
      setInterval(this.loadCommentsOnServer, this.props.intervalTime);
    },
    render: function () {
      return (
        <div className="comment">
          <h1 className="text-center">Comments</h1>
          <CommentList data={this.state.data}/>
          <CommentForm submitCommentToServer={this.submitCommentToServer}/>
        </div>
      )
    }
  });


  /**
   * CommentList 评论列表
   */
  var CommentList = React.createClass({
    render: function () {
      return (
        <div className="comment-list">
          <h3>评论列表</h3>
          <ul>
            {
              this.props.data.map(function (item, index) {
                return (
                  <li className="comment-item" key={index}>
                    <div className="media">
                      <div className="media-left">
                        <a href="#">
                          <img className="media-object thumbnail" src={item.icon} alt="..." style={{ width: '80px', height: '80px' }}>
                          </img>
                        </a>
                      </div>
                      <div className="media-body">
                        <h4 className="media-heading">{item.author}</h4>
                        <span>{item.content}</span>
                        <a href="#" className="pull-right">
                          <span className="badge like">
                            <span className="glyphicon glyphicon glyphicon-thumbs-up" aria-hidden="true">
                            </span>
                            &nbsp;{item.like}
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
      )
    }
  });


  /**
   * CommentForm 评论表单
   */
  var CommentForm = React.createClass({
    getInitialState: function () {
      return {
        id: -1, 
        author: '', 
        content: '', 
        icon: '', 
        like: 0 ,
      }
    },
    handleSubmit: function (event) {
      // 先阻止默认提交行为
      event.preventDefault();

      var state = this.state;
      if(state.author && state.content){
        var icon = icons[parseInt(icons.length*Math.random())];
        this.props.submitCommentToServer({
          id: +new Date(),
          author: state.author,
          content: state.content,
          icon: icon,
          like: 0,
        });
      }
    },
    handleChange: function (event) {
      var id = event.target.id;
      var value = event.target.value;
      if('commentName' === id){
        this.setState({ author: value });
      }else if('commentContent' === id){
        this.setState({ content: value });
      }
    },
    render: function () {
      var newComment = this.state.newComment;
      return (
        <div className="comment-form">
          <h3>发表评论</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="commentName">Name</label>
              <input onChange={this.handleChange} type="text" className="form-control" id="commentName" placeholder="Jane Doe"></input>
            </div>
            <div className="form-group">
              <label htmlFor="commentContent">Content</label>
              <textarea onChange={this.handleChange} className="form-control no-resize" id="commentContent" rows="3" placeholder="Content"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">提&nbsp;&nbsp;交</button>
          </form>
        </div>
      )
    }
  });


  /**
   * 渲染Comment组件
   */
  ReactDOM.render(
    <Comment REQUEST_URL="/api/comments" intervalTime={5000}/>,
    document.getElementById('example')
  )



})(window, document, React, ReactDOM)