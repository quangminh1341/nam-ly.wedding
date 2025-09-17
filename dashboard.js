document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generateButton');
    const guestListInput = document.getElementById('guestList');
    const resultTableBody = document.querySelector('#resultTable tbody');
    const resultContainer = document.getElementById('resultTableContainer');

    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', '');

    generateButton.addEventListener('click', () => {
        const guests = guestListInput.value.trim().split(',');
        
        resultTableBody.innerHTML = '';

        if (guestListInput.value.trim() === '') {
            resultContainer.style.display = 'none';
            return;
        }
        
        guests.forEach(guest => {
            const guestName = guest.trim();
            if (guestName) {
                const guestId = btoa(unescape(encodeURIComponent(guestName)));
                const personalizedLink = `${baseUrl}?guest=${guestId}`;
                
                const row = document.createElement('tr');
                
                // Cột Tên - Thêm class 'name-cell' để dễ chọn
                const nameCell = document.createElement('td');
                nameCell.textContent = guestName;
                nameCell.className = 'name-cell'; // <-- THÊM DÒNG NÀY
                
                // Cột Link với nút Copy
                const linkCell = document.createElement('td');
                const linkInput = document.createElement('input');
                linkInput.type = 'text';
                linkInput.value = personalizedLink;
                linkInput.readOnly = true;

                const copyButton = document.createElement('button');
                copyButton.textContent = 'Copy';
                copyButton.className = 'copy-btn';

                // ===== THAY THẾ TOÀN BỘ HÀM CLICK BẰNG ĐOẠN DƯỚI =====
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(personalizedLink).then(() => {
                        // 1. Thay đổi trạng thái nút vĩnh viễn
                        copyButton.textContent = 'Đã Copy!';
                        copyButton.disabled = true; // Vô hiệu hóa nút

                        // 2. Thêm icon tích xanh vào ô tên
                        // Kiểm tra để không thêm icon lần thứ hai
                        if (!nameCell.querySelector('.checkmark-icon')) {
                            const checkmark = document.createElement('span');
                            checkmark.className = 'checkmark-icon';
                            // Mã SVG của icon tích xanh
                            checkmark.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;
                            nameCell.appendChild(checkmark);
                        }
                        
                    }).catch(err => {
                        console.error('Không thể copy: ', err);
                    });
                });
                // ===== KẾT THÚC PHẦN THAY THẾ =====
                
                linkCell.appendChild(linkInput);
                linkCell.appendChild(copyButton);
                
                row.appendChild(nameCell);
                row.appendChild(linkCell);
                
                resultTableBody.appendChild(row);
            }
        });

        resultContainer.style.display = 'block';
    });
});