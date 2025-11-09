// source: https://github.com/photopea/UTIF.js

declare namespace UTIF {
  function decode(buffer: ArrayBuffer): any[];
  function decodeImage(ifd: any, buffer: ArrayBuffer): void;
  function toRGBA8(ifd: any): Uint8Array;
  function toRGBAImage(ifd: any): Uint8Array;
  function fromRGBA8(rgba: Uint8Array, width: number, height: number): ArrayBuffer;
}

declare const UTIF: typeof UTIF;
export default UTIF;
