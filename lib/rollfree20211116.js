/**
 * 轮播图公共组件--by Mark.Wu at 20210524
 * updata time 20211112 --解决换页不正常，遗留换页后1/2概率发生一次单页数据不更新（因为换页中js线程暂停），后面正常
 * @children [<jsx>] --中央展示区域组件
 * @contextStyle {}  --单条轮播组件style设置
 * @width number --轮播图width
 * @height number --轮播图height
 * @showBorder boolean --是否显示辅助设计边界
 * @horizontal boolean --横纵向轮播
 * @animationDirection boolean --默认切换方向
 * @endWithNum number --结尾空置滚动单位数量
 * @childrenUpdateModel string --数据更新后更新列表时机，'now'立即更新，'later'跑完更新
 * @bigNum string --默认100，支持大数据量动态更新，防止内存过大
 * @pauseWithHover boolean --默认开启，鼠标hover组件滚动停止
 * @animationTime number --过场时间 单位：S
 */
import React, { useEffect, useState, useRef } from 'react';

const RollFree = ({
  children = [
    <div key="carousel1" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      0
    </div>,
    <div key="carousel2" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      1
    </div>,
    <div key="carousel3" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      2
    </div>,
    <div key="carousel4" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      3
    </div>,
    <div key="carousel5" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      4
    </div>,
    <div key="carousel6" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      5
    </div>,
    <div key="carousel7" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      6
    </div>,
    <div key="carousel8" style={{ fontSize: '20px', color: '#007200', textAlign: 'center' }}>
      7
    </div>,
  ],
  contextStyle = {
    height: 100,
    width: 200,
  },
  width = 200,
  height = 600,
  showBorder = false,
  horizontal = false,
  animationDirection = true,
  endWithNum = 2,
  childrenUpdateModel = 'later',
  bigNum = 100,
  pauseWithHover = true,
  animationTime = 10,
}) => {
  const [type, order, nodes, onceTime, timers, timer, lastUpdate, anotherBug, runTime, running, windowFocusTimer] = [
    useRef(0),
    useRef(0),
    useRef([]),
    useRef(null),
    useRef(null),
    useRef(0),
    useRef(0),
    useRef(0),
    useRef(0),
    useRef(true),
    useRef(null),
  ];
  // 改成展示区域的长宽以及间距
  const [rollNode1, setNode1] = useState(null);
  const [rollNode2, setNode2] = useState(null);
  const onceShowNum = Math.ceil(horizontal ? width / contextStyle.width : height / contextStyle.height) + 1;
  const distance = onceShowNum * (horizontal ? contextStyle.width : contextStyle.height);
  const time = parseInt((animationTime / onceShowNum) * 1000) * onceShowNum;
  // window.onblur = () => {
  //   running.current = false;
  //   console.log('paused', running.current);
  //   setTimeout(() => (running.current = true), 200);
  // };
  // window.onfocus = () => {
  //   console.log('running', running.current);
  //   !running.current &&
  //     setTimeout(() => (running.current = true), time - ((new Date().getTime() - runTime.current) % time));
  // };
  window.addEventListener('visibilitychange', function () {
    windowFocusTimer.current = null;
    if (document.hidden) {
      running.current && (running.current = false);
      console.log('paused', running.current);
    } else {
      console.log('running', running.current);
      !running.current &&
        !windowFocusTimer.current &&
        (windowFocusTimer.current = setTimeout(() => {
          console.log('000', new Date().getTime());
          windowFocusTimer.current = null;
          running.current = true;
        }, time - ((new Date().getTime() - runTime.current) % time)));
    }
  });
  useEffect(() => {
    runTime.current = new Date().getTime();
    timeOut(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    anotherBug.current = anotherBug.current ? 0 : 1;
    if (!anotherBug.current) return;
    for (let i = 0; i < endWithNum; i++) {
      childrenUpdateModel === 'now'
        ? children.push(<div key={'end' + i} />)
        : children.unshift(<div key={'end' + i} />);
    }
    if (children.length <= onceShowNum + 1) {
      children =
        children.length / onceShowNum < 2 ? [...children, ...children] : [...children, ...children, ...children];
    }
    if (childrenUpdateModel !== 'now') {
      lastUpdate.current = nodes.current.length;
      children = [...nodes.current, ...children];
    }
    nodes.current = children;
    //初始化
    if (childrenUpdateModel === 'now') type.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const timeOut = (muchtime) => {
    onceTime.current = new Date().getTime();
    clear();
    if (runTime.current < 0) runTime.current += onceTime.current;
    timers.current = setTimeout(() => {
      requestAnimationFrame(() => {
        renderNode(type.current);
      });
    }, muchtime);
  };

  const clear = () => {
    if (timers.current) {
      clearTimeout(timers.current);
      timers.current = null;
    }
  };

  const pause = () => {
    const nowTime = new Date().getTime();
    timer.current = time - ((nowTime - onceTime.current + timer.current) % time);
    runTime.current -= nowTime;
    clear();
  };

  const renderNode = (ty) => {
    const len = nodes.current.length,
      nodeShow = [];
    let forLen = nodes.current.length,
      id = ty;
    while (forLen) {
      if ((id < ty + onceShowNum && id >= ty) || (ty >= len - onceShowNum + 1 && id < onceShowNum + ty - len))
        nodeShow.push(
          <div key={id + 'carl3'} className="showChart">
            {nodes.current[id]}
          </div>
        );
      if (id + 1 >= len) {
        id = 0;
      } else {
        ++id;
      }
      --forLen;
    }
    !animationDirection && nodeShow.reverse();
    order.current === 0 ? setNode1(nodeShow) : setNode2(nodeShow);
    order.current = order.current === 0 ? 1 : 0;
    if (lastUpdate.current && ty + onceShowNum >= lastUpdate.current) {
      nodes.current = nodes.current.slice(lastUpdate.current);
      type.current -= lastUpdate.current;
      lastUpdate.current = 0;
    } else if (lastUpdate.current && ty >= bigNum) {
      //  防止数据不停更新，无法释放内存
      nodes.current = nodes.current.slice(ty);
      type.current = 0;
      lastUpdate.current -= ty;
    }
    if (type.current + onceShowNum >= len) {
      type.current += onceShowNum - len;
    } else {
      type.current += onceShowNum;
    }
    timer.current = 0;
    // setTimeout执行时间纠正回调
    const nowTime = new Date().getTime();
    const jsTimersFixed = (nowTime - runTime.current) % time;
    if (!(Math.floor((nowTime - onceTime.current) / time) % 2 || running.current)) {
      order.current = order.current === 0 ? 1 : 0;
      console.log('切换！！！！');
    }
    console.log(jsTimersFixed, '错过', !running.current && Math.floor((nowTime - onceTime.current) / time));
    timeOut(jsTimersFixed > 100 ? time - jsTimersFixed : time);
  };

  return (
    <div className="carTop">
      <div
        className="contextStyleBox"
        onMouseEnter={() => pauseWithHover && pause()}
        onMouseLeave={() => pauseWithHover && timeOut(timer.current)}
      >
        <div className="parent">{rollNode1}</div>
        <div className="parent" style={{ animationDelay: `${time}ms` }}>
          {rollNode2}
        </div>
      </div>
      <style jsx="true">
        {`
          .carTop {
            position: absolute;
            left: 0px;
            top: 0px;
            overflow: visible;
            width: ${width}px;
            height: ${height}px;
            background: no-repeat center;
            background-size: 100% 100%;
            border: ${showBorder ? '2px solid green' : ''};
          }
          .contextStyleBox{
            width: ${horizontal ? distance : width}px;
            height: ${horizontal ? height : distance}px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .parent{
            position: absolute;
            left: 0px;
            top: 0px;
            border: ${showBorder ? '2px solid red' : ''};
            width: ${horizontal ? distance : width}px;
            height: ${horizontal ? height : distance}px;
            padding: 0;
            animation: rock ${time * 2}ms;
            animation-timing-function: linear !important;
            animation-iteration-count: infinite;
            display: flex;
            flex-direction: ${horizontal ? 'row' : 'column'};
            align-items: center;
            justify-content: center;
          }
          .contextStyleBox:hover .parent {
            animation-play-state: ${pauseWithHover ? 'paused' : 'running'};
          }
          .showChart {
            width: ${contextStyle.width}px;
            height: ${contextStyle.height}px;
            // border: ${showBorder ? '2px solid red' : ''};
          }
          @keyframes rock {
            0% {
              transform: ${horizontal ? 'translateX(' : 'translateY('}0px);
            }
            50% {
              transform: ${horizontal ? 'translateX(' : 'translateY('}${
          distance * -1 * (animationDirection ? 1 : -1)
        }px);
            }
            50.001% {
              transform: ${horizontal ? 'translateX(' : 'translateY('}${distance * (animationDirection ? 1 : -1)}px);
            }
            100% {
              transform: ${horizontal ? 'translateX(' : 'translateY('}0px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default RollFree;
