import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ScrollService {
  private _getDoc(): Document {
    return this._doc || document;
  }

  private _getWin(): Window {
    const doc = this._getDoc();
    return doc.defaultView || window;
  }

  constructor(@Inject(DOCUMENT) private _doc: any) {}

  /**
   * 设置滚动条至指定元素
   *
   * @param element 指定元素，默认 `document.body`
   * @param topOffset 偏移值，默认 `0`
   */
  scrollToElement(
    container: Element,
    element?: Element | null,
    topOffset: number = 0
  ): void {
    if (!element) {
      element = this._getDoc().body;
    }
    const win = this._getWin();
    if (container && container.scrollBy) {
      container.scrollBy(0, element!.getBoundingClientRect().top - topOffset);
    }
  }
}
