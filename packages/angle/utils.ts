export const calcAngle = (element: HTMLElement, event: MouseEvent): number => {
  const rect = element.getBoundingClientRect();

  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  //获得中心点和鼠标坐标连线，与y轴正半轴之间的夹角
  const x = Math.abs(originX - event.clientX);
  const y = Math.abs(originY - event.clientY);
  const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  const cos = y / z;
  const rad = Math.acos(cos); //用反三角函数求弧度
  let angle = Math.floor(180 / (Math.PI / rad)); //将弧度转换成角度

  if (event.clientX > originX && event.clientY > originY) {
    //鼠标在第四象限
    angle = 180 - angle;
  }

  if (event.clientX == originX && event.clientY > originY) {
    //鼠标在y轴负方向上
    angle = 180;
  }

  if (event.clientX > originX && event.clientY == originY) {
    //鼠标在x轴正方向上
    angle = 90;
  }

  if (event.clientX < originX && event.clientY > originY) {
    //鼠标在第三象限
    angle = 180 + angle;
  }

  if (event.clientX < originX && event.clientY == originY) {
    //鼠标在x轴负方向
    angle = 270;
  }

  if (event.clientX < originX && event.clientY < originY) {
    //鼠标在第二象限
    angle = 360 - angle;
  }

  return angle;
};

let isDragging = false;

export interface DragEventOption {
  drag?: (event: Event) => void;
  start?: (event: Event) => void;
  end?: (event: Event) => void;
}

export const triggerDragEvent = (element: HTMLElement, options: DragEventOption): void => {
  const moveFn = function (event: Event) {
    options.drag?.(event);
  };

  const upFn = function (event: Event) {
    document.removeEventListener("mousemove", moveFn, false);
    document.removeEventListener("mouseup", upFn, false);
    document.onselectstart = null;
    document.ondragstart = null;

    isDragging = false;

    options.end?.(event);
  };

  if (element) {
    element.addEventListener("mousedown", (event: Event) => {
      if (isDragging) return;
      document.onselectstart = () => false;
      document.ondragstart = () => false;
      document.addEventListener("mousemove", moveFn, false);
      document.addEventListener("mouseup", upFn, false);
      isDragging = true;

      options.start?.(event);
    });
  }

  return;
};
