<template>
  <div id="components-grid-demo-flex">
    <p>sub-element align left</p>
    <a-row type="flex" justify="start">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align center</p>
    <a-row type="flex" justify="center">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align right</p>
    <a-row type="flex" justify="end">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element monospaced arrangement</p>
    <a-row type="flex" justify="space-between">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>

    <p>sub-element align full</p>
    <a-row type="flex" justify="space-around">
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
      <a-col :span="4">col-4</a-col>
    </a-row>
  </div>
</template>

<style lang="less" scoped>
#components-grid-demo-flex :deep(.ant-row) {
  background: rgba(128, 128, 128, 0.08);
}
</style>
