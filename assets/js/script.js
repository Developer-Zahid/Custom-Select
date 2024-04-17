function customTriggerChangeEvent(element) {
    const customChangeEvent = new Event("change")
    element.dispatchEvent(customChangeEvent)
}

$(document).ready(function () {
    $('[data-select="custom"]').each(function(eachSelectIndex, eachSelectItem){
        const $eachSelectElement = $(this)
        $eachSelectElement.wrap('<div data-select="wrapper" class="custom-select-wrapper"></div>')
        const $eachSelectElementParent = $(this).closest('[data-select="wrapper"]')
        const isMultipleSelect = eachSelectItem.multiple
        $eachSelectElementParent.append(`
        <button type="button" class="custom-select__output" data-select="output" data-select-show="false"></button>
        <div class="custom-select__dropdown" data-select="dropdown">
            <div class="custom-select__dropdown__head">
                <input type="text" data-select-option="search" class="custom-select__dropdown__head__input" placeholder="Search">
            </div>
            <div class="custom-select__dropdown__body">
                <div class="custom-select__dropdown__list" data-select-option="list">
                    <div class="custom-select__dropdown__item custom-select__dropdown__item--empty" data-select-option="empty">No result found</div>
                </div>
            </div>
        </div>
        `)

        if(isMultipleSelect){
            if($eachSelectElement.val().length > 0){
                $eachSelectElement.val().map(eachSelectElementSelectedOption=>{
                    $eachSelectElementParent.find('[data-select="output"]').append(`<div class="custom-select__output__result">${eachSelectElementSelectedOption}</div>`)
                })
            }else{
                $eachSelectElementParent.find('[data-select="output"]').html(`<div class="custom-select__output__placeholder">${$eachSelectElement.data('placeholder')}</div>`)
            }
        }else{
            console.log(eachSelectItem);
            if(eachSelectItem.value != ''){
                $eachSelectElementParent.find('[data-select="output"]').html(`<div class="custom-select__output__result">${$(this).val()}</div>`)
            }else{
                $eachSelectElementParent.find('[data-select="output"]').html(`<div class="custom-select__output__placeholder">${$eachSelectElement.data('placeholder')}</div>`)
            }
        }

        Array.from(eachSelectItem.options).map((eachSelectOption)=>{
            const eacheachSelectOptionValue = eachSelectOption.value
            if(eacheachSelectOptionValue != ''){
                $eachSelectElementParent.find('[data-select-option="list"]').append(`
                <label class="custom-select__dropdown__item" data-select-option="item">
                    <input data-select="fake-option" type="${isMultipleSelect ? 'checkbox' : 'radio'}" name="${eachSelectItem.name != '' ? eachSelectItem.name : isMultipleSelect ? `select${eachSelectIndex}[]` : `select${eachSelectIndex}`}" value="${eacheachSelectOptionValue}" ${eachSelectOption.selected && 'checked'} class="custom-select__dropdown__item__input">
                    <div class="custom-select__dropdown__item__option"><span data-select-option="value">${eacheachSelectOptionValue}</span></div>
                </label>
                `)
            }
        })

        $eachSelectElementParent.find('[data-select-option="search"]').on('input', function(){
            let currentSearchedValue = $(this).val().toLowerCase()
            let notMatchAtAllArray = []
            $eachSelectElementParent.find('[data-select-option="value"]').filter(function() {
                $(this).closest('[data-select-option="item"]').toggle($(this).text().toLowerCase().indexOf(currentSearchedValue.trim()) > -1)
            })
            $eachSelectElementParent.find('[data-select-option="value"]').each(function(){
                notMatchAtAllArray.push($(this).text().toLowerCase().indexOf(currentSearchedValue.trim()) > -1)
            })
            if(notMatchAtAllArray.every((currentValue) => currentValue === false)){
                $eachSelectElementParent.find('[data-select-option="empty"]').show()
            }else{
                $eachSelectElementParent.find('[data-select-option="empty"]').hide()
            }
        })

        $(document).on('change', '[data-select="fake-option"]', function(){
            if(isMultipleSelect){
                let multipleSelectValueArray = []
                let $allCheckedOptionElement = $eachSelectElementParent.find('[data-select="fake-option"]:checked')
                $allCheckedOptionElement.each(function(){
                    multipleSelectValueArray.push($(this).val())
                })
                $eachSelectElement.val(multipleSelectValueArray)
                if(multipleSelectValueArray.length > 0){
                    $eachSelectElementParent.find('[data-select="output"]').html('')
                    $eachSelectElement.val().map(eachSelectElementSelectedOption=>{
                        $eachSelectElementParent.find('[data-select="output"]').append(`<div class="custom-select__output__result">${eachSelectElementSelectedOption}</div>`)
                    })
                }else{
                    $eachSelectElementParent.find('[data-select="output"]').html(`<div class="custom-select__output__placeholder">${$eachSelectElement.data('placeholder')}</div>`)
                }
            }else{
                $eachSelectElement.val($(this).val())
                $eachSelectElementParent.find('[data-select="output"]').html(`<div class="custom-select__output__result">${$(this).val()}</div>`)
            }
            customTriggerChangeEvent(eachSelectItem)
        })

        $eachSelectElementParent.find('[data-select="output"]').on('click', function(){
            if($(this).attr('data-select-show') == 'false'){
                $(this).attr('data-select-show', true)
            }else{
                $(this).attr('data-select-show', false)
            }
        })
    })
})