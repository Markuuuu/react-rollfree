/**
 * 滚动组件--by Mark.Wu at 20210524
 * updata time 20211112 --解决换页不正常，遗留换页后1/2概率发生一次单页数据不更新（因为换页中js线程暂停），后面正常
 * @animationDirection boolean --滚动方向，默认从下到上，从左到右
 * @animationTime number --过场时间 单位：S
 * @bigNum string --默认100，支持大数据量动态更新，防止内存过大
 * @children [<jsx>] --滚动组件，支持隐式传入
 * @childrenUpdateModel string --数据更新后更新列表时机，'now'立即更新，'later'跑完更新
 * @contextHeight number  --单条滚动组件height
 * @contextWidth number  --单条滚动组件width
 * @endWithNum number --结尾空置滚动单位数量
 * @height number --滚动外框height
 * @horizontal boolean --横纵向滚动
 * @pauseWithHover boolean --默认开启，鼠标hover组件滚动停止
 * @showBorder boolean --是否显示辅助设计边界
 * @width number --滚动外框width
 */
 import React, { useEffect, useState, useRef } from 'react';
 import { getUUID } from './utils';
 import propTypes from 'prop-types';
 
 let timeLog = [];
 const RollFree = ({
   children = [
     <div key="carousel1" style={{ fontSize: '14px', color: '#007200', textAlign: 'center' }}>
       欢迎使用rollfree，组件地址：https://github.com/Markuuuu/react-rollfree
     </div>,
   ],
   contextHeight = 20,
   contextWidth = 500,
   width = 200,
   height = 20,
   showBorder = false,
   horizontal = true,
   animationDirection = true,
   endWithNum = 0,
   childrenUpdateModel = 'later',
   bigNum = 100,
   pauseWithHover = true,
   animationTime = 10,
 }) => {
   const [
     type,
     order,
     nodes,
     onceTime,
     timers,
     timer,
     lastUpdate,
     anotherBug,
     runTime,
     running,
     windowFocusTimer,
     parentNode,
     rockName,
   ] = [
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
     useRef(null),
     useRef(''),
   ];
   // 改成展示区域的长宽以及间距
   const [rollNode1, setNode1] = useState(null);
   const [rollNode2, setNode2] = useState(null);
   const onceShowNum = Math.ceil(horizontal ? width / contextWidth : height / contextHeight) + 1;
   const distance = onceShowNum * (horizontal ? contextWidth : contextHeight);
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
   useEffect(() => {
     runTime.current = new Date().getTime();
    //  rockName.current = runTime.current;
     rockName.current = getUUID();
     timeOut(0);
     const eventHandle = () => {
       windowFocusTimer.current = null;
       if (document.hidden) {
         running.current && (running.current = false);
         // console.log('paused', running.current);
       } else {
         // console.log('running', running.current);
         !running.current &&
           !windowFocusTimer.current &&
           (windowFocusTimer.current = setTimeout(() => {
             // console.log('000', new Date().getTime());
             windowFocusTimer.current = null;
             running.current = true;
           }, time - ((new Date().getTime() - runTime.current) % time)));
       }
     };
     window.addEventListener('visibilitychange', eventHandle, false);
     return window.addEventListener('visibilitychange', eventHandle, false);
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
 
   // useEffect(() => {
   //   console.log(
   //     'document',
   //     parentNode.current && parentNode.current.children[0] && parentNode.current.children[0].clientHeight
   //   );
   //   if (parentNode.current && parentNode.current.children[0]) {
 
   //   }
   //   // eslint-disable-next-line react-hooks/exhaustive-deps
   // }, [parentNode.current && parentNode.current.children[0] && parentNode.current.children[0].clientHeight]);
 
   useEffect(() => {
     anotherBug.current = anotherBug.current ? 0 : 1;
     if (!children.length && children.type) children = [children];
     if (!anotherBug.current || !children.length) return;
     let ends = [];
     for (let i = 0; i < endWithNum; i++) {
       ends.push(<div key={'end' + i} />);
     }
     ends = childrenUpdateModel === 'now' ? [...children, ...ends] : [...ends, ...children];
     let middle = [...ends];
     while (middle.length <= onceShowNum + 1) {
       middle = [...middle, ...ends];
     }
     if (childrenUpdateModel !== 'now') {
       lastUpdate.current = nodes.current.length;
       middle = [...nodes.current, ...middle];
     } else {
       type.current = 0;
     }
     // console.log(children, 'children');
     nodes.current = middle;
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [children]);
 
   const timeOut = (muchtime) => {
     onceTime.current = new Date().getTime();
     clear();
     if (runTime.current < 0) runTime.current += onceTime.current;
     const raf = () => {
       timers.current = requestAnimationFrame(() => {
         if (new Date().getTime() - onceTime.current >= muchtime) {
           renderNode(type.current);
         } else {
           raf();
         }
       });
     };
     // timers.current = setTimeout(
     //   () => {
     //     clear();
     //     raf();
     //   },
     //   muchtime > 48 ? muchtime - 48 : muchtime
     // );
     // timers.current = setTimeout(() => {
     //   requestAnimationFrame(() => {
     //     renderNode(type.current);
     //   });
     // }, muchtime);
     raf();
   };
 
   const clear = () => {
     if (timers.current) {
       clearTimeout(timers.current) && cancelAnimationFrame(timers.current);
       timers.current = null;
     }
   };
 
   const pause = () => {
     const nowTime = new Date().getTime();
     // 暂停停止计时
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
           <div
             key={id + 'carl3'}
             className="rollfree-showChart"
             style={{ width: `${contextWidth}px`, height: `${contextHeight}px` }}
           >
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
     // 方向反向nodes倒置
     !animationDirection && nodeShow.reverse();
     order.current ? setNode2(nodeShow) : setNode1(nodeShow);
     order.current = order.current ? 0 : 1;
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
       order.current = order.current ? 0 : 1;
       // console.log('切换！！！！');
     }
     timeLog.push(jsTimersFixed);
     // console.log(
     //   timeLog,
     //   timeLog.reduce((p, n, i, arr) => {
     //     if (i + 1 === arr.length) return p / i + 1;
     //     return p + n;
     //   }, 0),
     //   jsTimersFixed,
     //   '延时',
     //   order.current,
     //   !running.current && Math.floor((nowTime - onceTime.current) / time)
     // );
     // 首次加载防止重叠time置后
     timeOut(!rollNode2 ? time + 48 : time - jsTimersFixed);
   };
 
   return (
     <div className="rollfree-rollTop" style={{ width: `${width}px`, height: `${height}px` }}>
       <div
         className={'rollfree-contextBox' + rockName.current}
         style={{ width: `${horizontal ? distance : width}px`, height: `${horizontal ? height : distance}px` }}
         onMouseEnter={() => pauseWithHover && pause()}
         onMouseLeave={() => pauseWithHover && timeOut(timer.current)}
       >
         <div className={'rollfree-parent' + rockName.current} ref={parentNode}>
           {rollNode1}
         </div>
         <div className={'rollfree-parent' + rockName.current} style={{ animationDelay: `${time}ms` }}>
           {rollNode2}
         </div>
       </div>
       <style jsx="true">
         {`
            .rollfree-rollTop {
              position: absolute;
              left: 0px;
              top: 0px;
              overflow: hidden;
              background: no-repeat center;
              background-size: 100% 100%;
              border: ${showBorder ? '2px solid green' : ''};
            }
            .rollfree-contextBox${rockName.current}{
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            .rollfree-parent${rockName.current}{
              //will-change: transform;
              position: absolute;
              left: 0px;
              top: 0px;
              border: ${showBorder ? '2px solid red' : ''};
              padding: 0;
              width: ${horizontal ? distance : width}px;
              height: ${horizontal ? height : distance}px;
              animation: rock${rockName.current} ${time * 2}ms;
              animation-timing-function: linear !important;
              animation-iteration-count: infinite !important;
              display: flex;
              flex-direction: ${horizontal ? 'row' : 'column'};
              align-items: center;
              justify-content: center;
            }
            .rollfree-contextBox${rockName.current}:hover .rollfree-parent${rockName.current} {
              animation-play-state: ${pauseWithHover ? 'paused' : 'running'};
            }
            .rollfree-showChart {
              //border: ${showBorder ? '1px solid blue' : ''};
            }
           @keyframes rock${rockName.current} {
             0% {
               transform: ${horizontal ? 'translateX(' : 'translateY('}${distance * (animationDirection ? 1 : -1)}px);
             }
             100% {
               transform: ${horizontal ? 'translateX(' : 'translateY('}${distance * (animationDirection ? -1 : 1)}px);
             }
           }
          `}
       </style>
     </div>
   );
 };
 
 RollFree.propTypes = {
   contextHeight: propTypes.number,
   contextWidth: propTypes.number,
   width: propTypes.number,
   height: propTypes.number,
   showBorder: propTypes.bool,
   horizontal: propTypes.bool,
   animationDirection: propTypes.bool,
   endWithNum: propTypes.number,
   childrenUpdateModel: propTypes.oneOf(['now', 'later']),
   bigNum: propTypes.number,
   pauseWithHover: propTypes.bool,
   animationTime: propTypes.number,
 };
 
 export default RollFree;
 