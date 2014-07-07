/* global D3SvgImageDownloader: true */
var D3SvgImageDownloader = (function () {

  function D3SvgImageDownloader(element, disablePanControl) {
    this.svg = element;
    this.svg.attr('version', 1.1).attr('xmlns', 'http://www.w3.org/2000/svg');
    this.imageVertices = this.svg.selectAll('image').size();
    this.disablePanControl = disablePanControl || false;
    this.existingElementStyles = [];
  }

  utils.mixin(D3SvgImageDownloader.prototype, {
    download: function () {
      utils.traverse(this.svg.node(), modifySvgElements, this);
    }

  });

  function modifySvgElements(element, ctx) {
    hidePanControl(ctx);
    changeImageSrcToBase64Uri(element, ctx);
    collectOriginalStyles(element, ctx);
    utils.explicitlySetStyle(element);
  }

  function changeImageSrcToBase64Uri(element, ctx) {
    if (element.nodeName.toLowerCase() !== 'image') {
      return;
    }

    var imageUrl = d3.select(element).attr('xlink:href');
    element.onload = function () {
      vertexImageLoaded(ctx);
    };
    utils.convertImgToBase64(imageUrl, function (img, dataUrl) {
      d3.select(element).attr('xlink:href', dataUrl);
    }, 'image/png');
  }

  function vertexImageLoaded(ctx) {
    ctx.imageVertices--;

    if (ctx.imageVertices === 0) {
      var serializer = new XMLSerializer();
      var svgStr = serializer.serializeToString(ctx.svg.node());
      var image = new Image();
      image.src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);

      image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = ctx.svg.attr('width');
        canvas.height = ctx.svg.attr('height');

        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        var a = document.createElement('a');
        a.download = 'image.png';
        a.href = canvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();

        restoreSvg(ctx);
      };
    }
  }

  function collectOriginalStyles(element, ctx) {
    if (element.nodeType !== 1 || !element.hasAttribute('style')) {
      return;
    }

    var id = Math.floor((Math.random() * 100000) + 1);
    var newClass = 'has-style-' + element.tagName + '-' +id;

    element.classList.add(newClass);
    ctx.existingElementStyles.push({
      id: newClass,
      style: element.getAttribute('style')
    });
  }

  function hidePanControl(ctx) {
    if (!ctx.disablePanControl) {
      return;
    }

    d3.select('#zoomPanControl').attr('style', 'display:none;');
  }

  function restoreSvg(ctx) {
    ctx.svg.attr('style', null);
    ctx.svg.selectAll('*').attr('style', null);

    for (var i = 0; i < ctx.existingElementStyles.length; i++) {
      var currentStyle = ctx.existingElementStyles[i];
      var newClass = '.' + currentStyle.id;
      var element = d3.select(newClass);

      element.attr('style', currentStyle.style);
      element.node().classList.remove(currentStyle.id);
    }
    d3.select('#zoomPanControl').attr('style', 'display:block;');
  }

  return D3SvgImageDownloader;
})();