/* global D3SvgImageDownloader: true */
var D3SvgImageDownloader = (function () {

  function D3SvgImageDownloader(element, graph, disablePanControl) {
    this.svg = element;
    this.graph = graph;
    this.svg.attr('version', 1.1)
      .attr('xmlns', 'http://www.w3.org/2000/svg').attr('xmlns:xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.imageVertices = this.svg.selectAll('image').size();
    this.disablePanControl = disablePanControl || false;
    this.existingElementStyles = [];
  }

  utils.mixin(D3SvgImageDownloader.prototype, {
    download: function () {
      this.graph.trigger('downloadStarted');
      hidePanControl(this);
      DomUtils.traverse(this.svg.node(), modifySvgElements, this);
      waitForImagesAndSave(this);
    }

  });

  function waitForImagesAndSave(ctx) {
    ctx.imageLoadedInterval = setInterval(saveAsImage, 100, ctx);
  }

  function saveAsImage(ctx) {
    if (ctx.imageVertices !== 0) {
      return;
    }

    var serializer = new XMLSerializer();
    var svgStr = serializer.serializeToString(ctx.svg.node());
    var image = new Image();

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
      ctx.graph.trigger('downloadFinished');
    };

    image.onerror = function() {
      console.log('Failed to save image.');
    };

    image.src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);
    clearInterval(ctx.imageLoadedInterval);
  }

  function modifySvgElements(element, ctx) {
    changeImageSrcToBase64Uri(element, ctx);
    collectOriginalStyles(element, ctx);
    DomUtils.explicitlySetStyle(element, ['defs'], true);
  }

  function changeImageSrcToBase64Uri(element, ctx) {
    if (element.nodeName.toLowerCase() !== 'image') {
      return;
    }
    var imageUrl = d3.select(element).attr('xlink:href');

    DomUtils.convertImgToBase64(imageUrl, function (img, dataUrl) {
      d3.select(element).attr('xlink:href', dataUrl);
      vertexImageLoaded(ctx);
    }, 'image/png');
  }

  function vertexImageLoaded(ctx) {
    ctx.imageVertices--;
  }

  function collectOriginalStyles(element, ctx) {
    if (element.nodeType !== window.Node.ELEMENT_NODE || !element.hasAttribute('style')) {
      return;
    }

    var id = Math.floor((Math.random() * 100000) + 1);
    var newClass = 'has-style-' + element.tagName + '-' +id;

    var newClasses = element.getAttribute('class') + ' ' + newClass;
    element.setAttribute('class', newClasses);
    element.setAttribute('className', newClasses);
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
      var element = d3.select(ctx.svg.node().parentNode).select(newClass);

      element.attr('style', currentStyle.style);
      var classes = element.node().className.baseVal.split(' ');
      var indexOfId = classes.indexOf(currentStyle.id);
      classes.splice(indexOfId, 1);
      var newClasses = classes.join(' ');
      element.node().setAttribute('class', newClasses);
      element.node().setAttribute('className', newClasses); //of course it's IE
    }
    d3.select('#zoomPanControl').attr('style', 'display:block;');
  }

  return D3SvgImageDownloader;
})();