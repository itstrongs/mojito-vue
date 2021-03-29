<template>
    <div id="app">
        <waterfall
                :align="align"
                :line-gap="300"
                :min-line-gap="100"
                :max-line-gap="220"
                :single-max-width="300"
                :watch="items"
                @reflowed="reflowed"
                ref="waterfall">
            <!-- each component is wrapped by a waterfall slot -->
            <waterfall-slot
                    v-for="(item, index) in items"
                    :width="item.width"
                    :height="item.height"
                    :order="index"
                    :key="item.index"
                    move-class="item-move"
            >
                <div class="item" :style="item.style" :index="item.index"></div>
            </waterfall-slot>
        </waterfall>
    </div>
</template>

<script>
    import Waterfall from 'vue-waterfall/lib/waterfall'
    import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

    export default {
        name: "demo-02",
        components: {
            Waterfall,
            WaterfallSlot
        },
        data() {
            return {
                align: 'center',
                items: [],
                isBusy: false
            }
        },
        created() {
            this.getItem(100);
            console.log("item ==> ", this.items)
        },
        methods: {
            getItem(count) {
                var items = [], i;
                var lastIndex = 0
                for (i = 0; i < count; i++) {
                    items[i] = {
                        index: lastIndex++,
                        style: {
                            background: this.getRandomColor()
                        },
                        width: 100 + ~~(Math.random() * 50),
                        height: 100 + ~~(Math.random() * 50)
                    }
                }
                this.items = items;
            },
            getRandomColor() {
                var colors = [
                    'rgba(21,174,103,.5)',
                    'rgba(245,163,59,.5)',
                    'rgba(255,230,135,.5)',
                    'rgba(194,217,78,.5)',
                    'rgba(195,123,177,.5)',
                    'rgba(125,205,244,.5)'
                ]
                return colors[~~(Math.random() * colors.length)]
            }
        }
    }
</script>

<style scoped>
    body {
        margin: 5px;
        font-family: Helvetica, sans-serif;
    }
    .item {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        font-size: 1.2em;
        color: rgb(0,158,107);
    }
    .item:after {
        content: attr(index);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
    }
    .wf-transition {
        transition: opacity .3s ease;
        -webkit-transition: opacity .3s ease;
    }
    .wf-enter {
        opacity: 0;
    }

</style>
