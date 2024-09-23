import { MessageAggregator } from "../message-aggregator"

describe("MessageAggregator", function () {
  afterEach(() => {
    jest.resetAllMocks
  })

  it("should group messages by any given group of keys", function () {
    const aggregator = new MessageAggregator()
    aggregator.save({
      // @ts-expect-error
      eventName: "ProductVariant.created",
      metadata: {
        source: "Product",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 999 },
    })
    aggregator.save({
      // @ts-expect-error
      eventName: "Product.created",
      metadata: {
        source: "Product",
        action: "created",
        object: "Product",
        eventGroupId: "1",
      },
      data: { id: 1 },
    })
    aggregator.save({
      // @ts-expect-error
      eventName: "ProductVariant.created",
      metadata: {
        source: "Product",
        action: "created",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 222 },
    })
    aggregator.save({
      // @ts-expect-error
      eventName: "ProductType.detached",
      metadata: {
        source: "Product",
        action: "detached",
        object: "ProductType",
        eventGroupId: "1",
      },
      data: { id: 333 },
    })
    aggregator.save({
      // @ts-expect-error
      eventName: "ProductVariant.updated",
      metadata: {
        source: "Product",
        action: "updated",
        object: "ProductVariant",
        eventGroupId: "1",
      },
      data: { id: 123 },
    })

    const format = {
      groupBy: ["eventName", "metadata.object", "metadata.action"],
      sortBy: {
        "metadata.object": ["ProductType", "ProductVariant", "Product"],
        "data.id": "asc",
      },
    }

    const messages = aggregator.getMessages(format)

    expect(Object.keys(messages)).toHaveLength(4)

    const allGroups = Object.values(messages)

    expect(allGroups[0]).toEqual([
      {
        eventName: "ProductType.detached",
        metadata: {
          source: "Product",
          action: "detached",
          object: "ProductType",
          eventGroupId: "1",
        },
        data: { id: 333 },
      },
    ])

    expect(allGroups[1]).toEqual([
      {
        eventName: "ProductVariant.updated",
        metadata: {
          source: "Product",
          action: "updated",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 123 },
      },
    ])

    expect(allGroups[2]).toEqual([
      {
        eventName: "ProductVariant.created",
        metadata: {
          source: "Product",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 222 },
      },
      {
        eventName: "ProductVariant.created",
        metadata: {
          source: "Product",
          action: "created",
          object: "ProductVariant",
          eventGroupId: "1",
        },
        data: { id: 999 },
      },
    ])

    expect(allGroups[3]).toEqual([
      {
        eventName: "Product.created",
        metadata: {
          source: "Product",
          action: "created",
          object: "Product",
          eventGroupId: "1",
        },
        data: { id: 1 },
      },
    ])
  })
})
