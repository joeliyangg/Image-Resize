// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const controls = document.getElementById('controls');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalInfo = document.getElementById('originalInfo');
const compressedInfo = document.getElementById('compressedInfo');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentImage = null;

// 绑定上传相关事件
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#0071e3';
});
dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#ccc';
});
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        processImage(e.target.files[0]);
    }
});

// 处理图片
function processImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = new Image();
        currentImage.src = e.target.result;
        currentImage.onload = () => {
            // 显示原图预览
            originalPreview.src = currentImage.src;
            originalInfo.textContent = `尺寸: ${currentImage.width}x${currentImage.height} | 大小: ${(file.size / 1024).toFixed(2)}KB`;
            
            // 显示预览区域和控制区域
            previewContainer.style.display = 'flex';
            controls.style.display = 'block';
            
            // 压缩图片
            compressImage();
        };
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    
    // 绘制图片
    ctx.drawImage(currentImage, 0, 0);
    
    // 压缩
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // 显示压缩后的预览
    compressedPreview.src = compressedDataUrl;
    
    // 计算压缩后的大小
    const compressedSize = (compressedDataUrl.length * 3/4) / 1024;
    compressedInfo.textContent = `尺寸: ${currentImage.width}x${currentImage.height} | 大小: ${compressedSize.toFixed(2)}KB`;
}

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
    if (currentImage) {
        compressImage();
    }
});

// 下载按钮事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedPreview.src;
    link.click();
}); 